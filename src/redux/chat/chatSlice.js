import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* ── Mock AI call — replace with real API ── */
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (userInput, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const responses = [
        `Based on your query about **${userInput.slice(0, 30)}...**, here are the relevant medical codes:\n\n**ICD-10 Codes:**\n- \`J44.0\` - COPD with acute lower respiratory infection\n- \`J44.1\` - COPD with acute exacerbation\n\n**CPT Codes:**\n- \`99213\` - Office visit, established patient, level 3\n- \`94060\` - Bronchodilation responsiveness, spirometry\n\nPlease verify these codes with the latest coding guidelines.`,
        `I've analyzed your medical coding query:\n\n**Primary Diagnosis:**\n- ICD-10: \`E11.9\` - Type 2 diabetes mellitus without complications\n\n**Procedure Codes:**\n- \`99214\` - Established patient visit, moderate complexity\n- \`80053\` - Comprehensive metabolic panel\n- \`83036\` - Hemoglobin A1C level\n\n**Modifiers:**\n- Modifier \`25\` may be applicable if a separate E/M service was provided`,
        `Based on the clinical documentation:\n\n**Recommended Codes:**\n- **ICD-10:** \`I10\` - Essential (primary) hypertension\n- **CPT:** \`99203\` - New patient office visit, low to moderate complexity\n\n**Documentation Requirements:**\n- Blood pressure readings\n- Patient history\n- Treatment plan\n\n*Note: Always ensure proper documentation supports the selected codes.*`,
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    } catch (err) {
      return rejectWithValue('Failed to get AI response.');
    }
  }
);

const initialChatHistory = [
  { id: '1', title: 'ICD-10 Codes for COPD' },
  { id: '2', title: 'CPT Codes - Office Visit' },
  { id: '3', title: 'Type 2 Diabetes Coding' },
  { id: '4', title: 'Hypertension Documentation' },
  { id: '5', title: 'Modifier 25 Usage Guide' },
  { id: '6', title: 'E/M Level Selection' },
  { id: '7', title: 'Preventive Care Codes' },
  { id: '8', title: 'Chronic Care Management' },
  { id: '9', title: 'ICD-10 Codes for COPD' },
  { id: '10', title: 'CPT Codes - Office Visit' },
  { id: '21', title: 'Type 2 Diabetes Coding' },
  { id: '41', title: 'Hypertension Documentation' },
  { id: '51', title: 'Modifier 25 Usage Guide' },
  { id: '61', title: 'E/M Level Selection' },
  { id: '71', title: 'Preventive Care Codes' },
  { id: '81', title: 'Chronic Care Management' },
  { id: '11', title: 'ICD-10 Codes for COPD' },
  { id: '21', title: 'CPT Codes - Office Visit' },
  { id: '31', title: 'Type 2 Diabetes Coding' },
  { id: '41', title: 'Hypertension Documentation' },
  { id: '51', title: 'Modifier 25 Usage Guide' },
  { id: '61', title: 'E/M Level Selection' },
  { id: '71', title: 'Preventive Care Codes' },
  { id: '81', title: 'Chronic Care Management' },
];

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    isTyping: false,
    input: '',
    chatHistory: initialChatHistory,
    activeChatId: '1',
  },
  reducers: {
    setInput(state, action) {
      state.input = action.payload;
    },
    clearInput(state) {
      state.input = '';
    },
    newChat(state) {
      const newChat = { id: Date.now().toString(), title: 'New Chat' };
      state.chatHistory = [newChat, ...state.chatHistory];
      state.activeChatId = newChat.id;
      state.messages = [];
      state.input = '';
    },
    selectChat(state, action) {
      state.activeChatId = action.payload;
      state.messages = [];
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        /* Add the user message immediately */
        state.messages.push({
          id: Date.now(),
          type: 'user',
          content: action.meta.arg,
          isTyping: false,
        });
        state.input = '';
        state.isTyping = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        state.messages.push({
          id: Date.now() + 1,
          type: 'ai',
          content: action.payload,
          isTyping: true,
        });
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isTyping = false;
      });
  },
});

export const { setInput, clearInput, newChat, selectChat, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;

/* ── Selectors ── */
export const selectMessages     = (state) => state.chat.messages;
export const selectIsTyping     = (state) => state.chat.isTyping;
export const selectInput        = (state) => state.chat.input;
export const selectChatHistory  = (state) => state.chat.chatHistory;
export const selectActiveChatId = (state) => state.chat.activeChatId;