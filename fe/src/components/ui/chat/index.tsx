import { socket } from 'lib/socket';
import React, { useEffect, useRef, useState } from 'react'
import { useAuthApp } from 'store/useAuthApp';
import { useGlobalAppStore } from 'store/useGlobalApp'
import avt_default from 'assets/img_custom/public_botany_2.png'
import avt_default1 from 'assets/img_custom/uikit_emoji_icon_normal.png'
import bg_avt from 'assets/img_custom/trialtask_bg_nums.png'
import { renderVip } from 'constants/vipIcon';
import clsx from 'clsx';
import { notification } from 'antd';

interface Message {
  _id?: string
  content: string;
  sender: any;
  createdAt?: string | number | Date
}

const BoxChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthApp();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    const handleLoadMessage = () => {
      if (user && socket.connected) {
        socket.emit("getAllMessage", { userId: user._id });
        socket.emit("getUnreadCount", { userId: user._id });
      }
    };

    // Lắng new message
    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    // Lắng old messages
    const handleOldMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    if (user) {
      socket.on("newMessage", handleNewMessage);
      socket.on("loadOldMessages", handleOldMessages);
      socket.on("connect", handleLoadMessage); // 👈 emit lại khi kết nối xong

      // Nếu socket đã kết nối thì gọi luôn
      if (socket.connected) {
        handleLoadMessage();
      }
    }

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("loadOldMessages", handleOldMessages);
      socket.off("connect", handleLoadMessage);
    };
  }, [user?._id]);

  const blacklist = ["xấu", "bậy", "chửi", "fuck", "shit", "đm", "ngu", "sập",
    "app vịt", "app gà", "nào sập"
  ]; // ví dụ

  function filterBadWords(text: string, blacklist: string[]): string {
    const regex = new RegExp(`\\b(${blacklist.join("|")})\\b`, "gi");
    return text.replace(regex, "***");
  }


  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.isLockChat) return notification.error({
      message: "Account locked !!!",
      duration: 3,
      placement: "top"
    })
    if (!input.trim()) return;
    if (!user || !user._id) {
      return;
    }
    const cleanInput = filterBadWords(input.trim(), blacklist);
    const newMsg: Message = {
      content: cleanInput,
      sender: user._id, // chắc chắn có sender
    };

    socket.emit("sendMessage", newMsg);
    setInput("");
  };

  return (
    <section className="msger">

      <main className="msger-chat" ref={chatRef}>
        {messages.map(({ sender, content, createdAt, _id }, idx) => {
          const isYou = sender?.userId === user?.userId;
          if (isYou) return (
            <div className="msg right-msg" key={_id} >
              <div
                className="msg-img"

              >
                <div className='relative'>
                  <img src={bg_avt} alt='logo' className='rounded-full w-[10rem] h-[10rem] z-10' />
                  <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                    <img src={avt_default} alt='logo' className='rounded-full w-[10rem] h-[10rem] z-10' />
                  </div>
                  {
                    sender?.farmVip > 0 &&
                    <div className='absolute top-[-5px] right-[-5px] z-20'>
                      <span>
                        <img src={renderVip(sender?.farmVip || 0)} className={clsx('size-[15px]', {
                          "!size-[25px]": sender?.farmVip > 0
                        })} />
                      </span>
                    </div>
                  }

                </div>
              </div>
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name flex items-center gap-2">Bạn


                  </div>
                  <div className="msg-info-time">
                    {new Date(createdAt as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="msg-text whitespace-pre-line w-full break-words">
                  {content}
                </div>
              </div>
            </div>
          )
          return (
            <div className="msg left-msg" key={_id} >
              <div className='relative'>
                <img src={bg_avt} alt='logo' className='rounded-full w-[10rem] h-[10rem] z-10' />
                <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                  <img src={!sender ? avt_default1 : avt_default} alt='logo' className='rounded-full w-[10rem] h-[10rem] z-10' />
                </div>
                {
                  sender?.farmVip > 0 &&
                  <div className='absolute top-[-5px] right-[-5px] z-20'>
                    <span>
                      <img src={renderVip(sender?.farmVip || 0)} className={clsx('size-[15px]', {
                        "!size-[25px]": sender?.farmVip > 0
                      })} />
                    </span>
                  </div>
                }
              </div>
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name flex items-center gap-1">{
                    !sender ? "ADMIN FARMING GAME" :
                      sender?.phone}

                  </div>
                  <div className="msg-info-time">
                    {new Date(createdAt as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="msg-text whitespace-pre-line w-full break-words">
                  {content}
                </div>
              </div>
            </div>
          )
        })}
      </main>
      <form className="msger-inputarea" onSubmit={handleSend}>
        <input
          type="text"
          className="msger-input"
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="msger-send-btn">
          Send
        </button>
      </form>
    </section>

  )
}

export default BoxChat