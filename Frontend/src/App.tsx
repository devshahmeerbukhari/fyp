
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route for routing
import Navbar from './Pages/Navbar';
import SearchBar from './components/SearchBar/Searchbar';
import HotelSearch from './components/HotelSearch/HotelSearch';
import ChatBot from './components/Chatbot/Chatbot';


const App = () => {
  return (
    <div className="font-sans">
      <Navbar />
      {/* <SearchBar /> */}
      <Routes>
        <Route path="/" element={<SearchBar />} /> {/* Example Home Route */}
        <Route path="/lahore" element={<SearchBar />} />
        <Route path="/components/hotels" element={<HotelSearch />} />
        <Route path="/things-to-do" element={<SearchBar />} />
        <Route path="/restaurants" element={<SearchBar />} />
        <Route path="/flights" element={<SearchBar />} />
        {/* Add other routes */}
      </Routes>
      <ChatBot/>
    </div>
  );
};

export default App;
