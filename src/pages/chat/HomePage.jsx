import { useDispatch, useSelector } from 'react-redux';
import MedicalCodingChat from './MedicalCodingChat';
import { selectDarkMode } from '../../redux/ui/uiSlice';
import {
  selectMessages,
  selectIsTyping,
  selectInput,
  setInput,
  sendMessage,
} from '../../redux/chat/chatSlice';
import ProfilePage from '../auth/ProfilePage';

const HomePage = () => {
  const dispatch = useDispatch();

  const darkMode = useSelector(selectDarkMode);
  const messages = useSelector(selectMessages);
  const isTyping = useSelector(selectIsTyping);
  const input    = useSelector(selectInput);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(sendMessage(input));
  };

  return (
    <div className="h-full">
      <MedicalCodingChat
        messages={messages}
        input={input}
        onInputChange={(val) => dispatch(setInput(val))}
        onSend={handleSend}
        isTyping={isTyping}
        darkMode={darkMode}
      />
      <ProfilePage darkMode={darkMode}/>
    </div>
  );
};

export default HomePage;