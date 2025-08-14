import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getArtists } from "../../services/artistsAPI"

// Async thunks for API calls
export const fetchArtists = createAsyncThunk("artists/fetchArtists", async () => {
  const response = await getArtists()
  return response
})

const initialState = {
  artists: [],
  loading: false,
  error: null,
}

const artistsSlice = createSlice({
  name: "artists",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearArtists: (state) => {
      state.artists = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Artists
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false
        state.artists = action.payload
        state.error = null
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearError, clearArtists } = artistsSlice.actions

export default artistsSlice.reducer
