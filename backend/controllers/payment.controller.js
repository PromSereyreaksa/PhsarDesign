// controllers/payment.controller.js
import Stripe from 'stripe';
import { Op } from 'sequelize';
import { Projects, Users } from '../models/index.js';
import { validate as isUUID } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { projectId, amount, currency = 'usd', description } = req.body;
    const userId = req.user.id;

    // Validate UUID format
    if (!isUUID(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    // Validate the project exists and user has permission
    const project = await Projects.findOne({
      where: { projectId: projectId },
      include: [{ model: Users, as: 'client' }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Ensure only the client can create payment for their project
    if (project.clientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create payment for this project'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description: description || `Payment for project: ${project.title}`,
      metadata: {
        projectId: projectId.toString(),
        clientId: userId.toString(),
        freelancerId: project.freelancerId?.toString() || ''
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Payment intent created successfully',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Confirm a payment
 * @route POST /api/payments/confirm
 * @access Protected
 */
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
    });

    // Update project status if payment successful
    if (paymentIntent.status === 'succeeded') {
      const projectId = paymentIntent.metadata.projectId;
      await Projects.update(
        { status: 'paid', paymentStatus: 'completed' },
        { where: { projectId: projectId } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed',
      data: {
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Create a setup intent for saving payment methods
 * @route POST /api/payments/setup-intent
 * @access Protected
 */
export const createSetupIntent = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get or create Stripe customer
    let stripeCustomerId = req.user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: userId.toString()
        }
      });
      
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await Users.update(
        { stripeCustomerId },
        { where: { userId: userId } }
      );
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session'
    });

    res.status(200).json({
      success: true,
      message: 'Setup intent created successfully',
      data: {
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      }
    });

  } catch (error) {
    console.error('Create setup intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create setup intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get saved payment methods for a user
 * @route GET /api/payments/payment-methods
 * @access Protected
 */
export const getPaymentMethods = async (req, res) => {
  try {
    const stripeCustomerId = req.user.stripeCustomerId;

    if (!stripeCustomerId) {
      return res.status(200).json({
        success: true,
        message: 'No payment methods found',
        data: { paymentMethods: [] }
      });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card',
    });

    res.status(200).json({
      success: true,
      message: 'Payment methods retrieved successfully',
      data: {
        paymentMethods: paymentMethods.data.map(pm => ({
          id: pm.id,
          type: pm.type,
          card: {
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year
          }
        }))
      }
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment methods',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Delete a payment method
 * @route DELETE /api/payments/payment-methods/:paymentMethodId
 * @access Protected
 */
export const deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    await stripe.paymentMethods.detach(paymentMethodId);

    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully'
    });

  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment method',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Handle Stripe webhooks
 * @route POST /api/payments/webhook
 * @access Public (but verified)
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update project status
        if (paymentIntent.metadata.projectId) {
          await Projects.update(
            { 
              status: 'paid', 
              paymentStatus: 'completed',
              paymentIntentId: paymentIntent.id
            },
            { where: { projectId: paymentIntent.metadata.projectId } }
          );
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Update project status
        if (failedPayment.metadata.projectId) {
          await Projects.update(
            { paymentStatus: 'failed' },
            { where: { projectId: failedPayment.metadata.projectId } }
          );
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
};

/**
 * Get payment history for a user
 * @route GET /api/payments/history
 * @access Protected
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;

    // Get projects with payment information
    const projects = await Projects.findAndCountAll({
      where: {
        [Op.or]: [
          { clientId: userId },
          { freelancerId: userId }
        ]
      },
      include: [
        { model: Users, as: 'client', attributes: ['userId', 'firstName', 'lastName', 'email'] },
        { model: Users, as: 'freelancer', attributes: ['userId', 'firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.status(200).json({
      success: true,
      message: 'Payment history retrieved successfully',
      data: {
        payments: projects.rows,
        pagination: {
          total: projects.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(projects.count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment history',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
