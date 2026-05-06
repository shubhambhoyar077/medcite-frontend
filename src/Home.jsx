import React, { useState } from 'react';
import Sidebar from './components/navigation/Sidebar';
import Topbar from './components/navigation/Topbar';
import MedicalCodingChat from './MedicalCodingChat';

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([
    { id: '1', title: 'ICD-10 Codes for COPD' },
    { id: '2', title: 'CPT Codes - Office Visit' },
    { id: '3', title: 'Type 2 Diabetes Coding' },
    { id: '4', title: 'Hypertension Documentation' },
    { id: '5', title: 'Modifier 25 Usage Guide' },
    { id: '6', title: 'E/M Level Selection' },
    { id: '7', title: 'Preventive Care Codes' },
    { id: '8', title: 'Chronic Care Management' },
    { id: '9', title: 'Chronic Care Management' },
    { id: '10', title: 'Chronic Care Management' },
    { id: '11', title: 'Chronic Care Management' },
    { id: '12', title: 'Chronic Care Management' },
    { id: '13', title: 'Chronic Care Management' },
  ]);
  const [activeChatId, setActiveChatId] = useState('1');
  
  const [models] = useState([
    { id: '1', name: 'GPT-4' },
    { id: '2', name: 'Claude 3.5 Sonnet' },
    { id: '3', name: 'Gemini Pro' },
  ]);
  const [selectedModelId, setSelectedModelId] = useState('1');
  
  const [user] = useState({
    full_name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medicare.com'
  });

  const callAIAPI = async (userMessage) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = [
      `Based on your query about **${userMessage.slice(0, 30)}...**, here are the relevant medical codes:

**ICD-10 Codes:**
- \`J44.0\` - Chronic obstructive pulmonary disease with acute lower respiratory infection
- \`J44.1\` - Chronic obstructive pulmonary disease with acute exacerbation

**CPT Codes:**
- \`99213\` - Office or other outpatient visit, established patient, level 3
- \`94060\` - Bronchodilation responsiveness, spirometry

Please verify these codes with the latest coding guidelines.`,
      
      `I've analyzed your medical coding query:

**Primary Diagnosis:**
- ICD-10: \`E11.9\` - Type 2 diabetes mellitus without complications

**Procedure Codes:**
- \`99214\` - Established patient visit, moderate complexity
- \`80053\` - Comprehensive metabolic panel
- \`83036\` - Hemoglobin A1C level

**Modifiers:**
- Modifier \`25\` may be applicable if separate E/M service was provided

Would you like me to explain any of these codes?`,
      
      `Based on the clinical documentation:

**Recommended Codes:**
- **ICD-10:** \`I10\` - Essential (primary) hypertension
- **CPT:** \`99203\` - New patient office visit, low to moderate complexity

**Documentation Requirements:**
- Blood pressure readings
- Patient history
- Treatment plan

*Note: Always ensure proper documentation supports the selected codes.*`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      isTyping: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponseContent = await callAIAPI(input);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponseContent,
        isTyping: true
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
    };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    setMessages([]);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isMinimized={isSidebarMinimized}
        setIsMinimized={setIsSidebarMinimized}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        activeChatId={activeChatId}
        user={user}
        onLogout={() => alert('Logout')}
        onProfileClick={() => alert('Profile')}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          models={models}
          selectedModelId={selectedModelId}
          onModelChange={(id) => setSelectedModelId(id)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(!darkMode)}
        />

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <MedicalCodingChat
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            isTyping={isTyping}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;