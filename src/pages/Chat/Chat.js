import React, { useContext, useEffect, useState, useRef } from 'react';
import "./chat.css";
import Topbar from "../../components/Topbar/Topbar.js";
import Footer from "../../components/Footer/Footer.js";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.js";
import RightSidebar from "../../components/RightSidebar/RightSidebar.js";
import Conversation from '../../components/Conversation/Conversation.js';
import { AuthContext } from '../../context/AuthContext.js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {public_folder} from "../../variable.js";
import Message from '../../components/Message/Message.js';
import {io} from "socket.io-client";
import { MAIN_URL_SOCKET, MAIN_URL } from '../../variable.js';
import { deleteConv } from '../../api.js';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const {user} = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [mainFriend, setMainFriend] = useState({});
  const socket = useRef();
  const location = useLocation();
  const scrollRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("setup connection socket");
    const createConversation = async () => {
      try {
        const isExist = await axios.get(`${MAIN_URL}/api/conversations/` + user._id);
        console.log("user.id: " + JSON.stringify(user._id));
        console.log("isExist: " + JSON.stringify(isExist.data));
        if (isExist.data.length === 0) {
          console.log("if (isExist.data.length === 0)");
          try {
            const convers = await axios.post(`${MAIN_URL}/api/conversations`, {
              senderId: user._id,
              receiverId: location.state._id
            });
            console.log("convers:", JSON.stringify(convers.data));
          } catch (error) {
            console.log("error: " + error);
          }
        } else {
          console.log("} else {");
          const isFriendIncluded = [];
          isExist.data.forEach(conversation => {
            if (conversation.members.includes(location.state._id)) isFriendIncluded.push(conversation);
          });
          if (!isFriendIncluded.length > 0) {
            try {
              const conver = await axios.post(`${MAIN_URL}/api/conversations`, {
                senderId: user._id,
                receiverId: location.state._id
              });
            } catch (error) {
              console.log("error: " + error);
            }
          }
        }
      } catch (error) {
        console.log("error: " + error);
      }
    }
    createConversation();
    console.log("location.state:", JSON.stringify(location.state));
    location.state && setMainFriend(location.state);
    socket.current = io(`ws:${MAIN_URL_SOCKET}`);
    socket.current.on("getMessage", ({senderId, text}) => {
      setArrivalMessage({
        sender: senderId,
        text,
        createdAt: Date.now()
      });
    });
  }, []);

  useEffect(() => {
    console.log("useEffect with arrivalMessage and currentChat");
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
    setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    console.log("emittin addUser");
    user !== null && socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", users => {
      console.log("users: " + JSON.stringify(users));
    });
  }, [user]);

  useEffect(() => {
    console.log("getConversations in useEffect");
    const getConversations = async () => {
      try {
        const response = await axios.get(`${MAIN_URL}/api/conversations/${user?._id}`);
        console.log("all conversations:", JSON.stringify(response.data));
        setConversations(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user]);


  useEffect(() => {
    console.log("getMessages in useEffect");
    console.log("currentChat:", JSON.stringify(currentChat));
    const getMessages = async () => {
      try{
        const response = await axios.get(`${MAIN_URL}/api/messages/` + currentChat?._id);
        console.log("messages:", JSON.stringify(response.data));
        setMessages(response.data);
      }catch (error) {
        console.log("error:", error);
      }
    };

    const getMainFriend = async () => {
      currentChat.members.forEach(async (member) => {
        if (member !== user._id) {
          try {
            const res = await axios.get(`${MAIN_URL}/api/auth/${member}`);
            console.log("RESPONSE:", JSON.stringify(res));
            res.data && setMainFriend(res.data);
          } catch (error) {
            console.log("error:", error);
          }
        }
      });
    };
    getMessages();
    currentChat && getMainFriend();
    console.log("FRIEND:", JSON.stringify(mainFriend));
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("sending message!");
    const message = {
      sender: user._id,
      conversationId: currentChat._id,
      text: newMessage,
    }

    try {
      const response = await axios.post(`${MAIN_URL}/api/messages`, message);
      console.log("response.data: " + JSON.stringify(response.data));
      setMessages([...messages, response.data]);
      setNewMessage("");
      socket.current.emit("sendMessage", {senderId: user._id, receiverId: location.state._id, text: newMessage});
    } catch (error) {
      console.log("error:", error);
      alert("The message hasn't been sent! Try again later.");
    }
  }

  useEffect(() => {
    console.log("scroll to messages");
    if (currentChat !== null) {
      console.log("scrolling is done!");
      scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }
  }, [messages]);

  const deleteConversation = async (conversationId) => {
    const result = await deleteConv(conversationId);
    if (result.isDeleted) {
      alert("Conversation has successfully been deleted!");
    } else {
      alert("Conversation has failed to be deleted!");
    }
    navigate("/");
  };

  return (
    <>
        <Topbar />
        <LeftSidebar />
        <main className='chat'>
          <div className="chat__container">
            <div className="card">
              <div className="card__chat-scroller">
                <div className="header">
                  <div className="user">
                    <div className="user__img">
                      <img src={user?.profile_img === "/noAvatar-big.png" ? (public_folder + user?.profile_img) : (public_folder + "users/" + user?.profile_img)} alt="User" />
                    </div>
                    <div className="user__title">
                      <span className="username">{user.username}</span>
                      {/* <span className="job">Wev developer</span> */}
                    </div>
                  </div>
                  {/* <div className="search">
                    <input type="search" name="search" placeholder="Search" id="search" />
                  </div> */}
                </div>
                <div className="content">
                  <h5 className="title">Channels</h5>
                  <ul>
                    {conversations.map((c, index) => (
                      <div key={index} onClick={() => setCurrentChat(c)}>
                        <Conversation conversation={c} currentUser={user}/>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="card__chat-data">
                <div className="header">
                  {currentChat ? (
                    <div className="header__wrapp">
                      <div className="user">
                        {mainFriend && console.log("main friend:", JSON.stringify(mainFriend))}
                        <img src={mainFriend &&
                          mainFriend.profile_img === "/noAvatar-big.png" ? (public_folder + mainFriend.profile_img) : (public_folder + "users/" + mainFriend.profile_img)} alt="User" />
                        <span>{mainFriend && mainFriend.username}</span>
                      </div>
                      <div className="voip">
                        {/* <button type='button' className='audio'><img src="/assets/images/telephone.png" alt="Audio call" /></button>
                        <button type='button' className='video'><img src="/assets/images/movie.png" alt="Video call" /></button> */}
                        <button type='button' className='delete' onClick={() => deleteConversation(currentChat._id)}><img src="/assets/images/delete.png" alt="Delete channel" /></button>
                      </div>
                  </div>
                  ) : null}
                </div>
                <div className="content">
                  {currentChat ?
                    <>
                      {messages.length > 0 ? (
                        messages.map((m, index) => {
                          return (
                            <div ref={scrollRef} key={index}>
                              <Message main={m.sender === user._id} message={m} other={location.state}/>
                            </div>
                          )
                        })
                      ) : (
                        <div key="a" className="no__message">
                          <img alt="User" src={mainFriend &&
                          mainFriend.profile_img === "/noAvatar-big.png" ? (public_folder + mainFriend.profile_img) : (public_folder + "users/" + mainFriend.profile_img)}></img>
                          <span>{mainFriend && mainFriend.username}</span>
                          <h3>You haven't started chatting</h3>
                        </div>
                      )}
                    </> : 
                    <span className='no__conversation'>Open a conversation to start a chat</span>
                  }
                </div>
                  {currentChat ? (
                    <div className="footer">
                      <form onSubmit={handleSubmit}>
                        <input type="text" className="text" placeholder="Type your message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                        <button type="submit"><img src={public_folder + "/telegram.png"} alt="Send message" /> Send</button>
                      </form>
                    </div>
                  ) : null}
              </div>
            </div>
          </div>
        </main>
        <Footer />
    </>
  )
}

export default Chat