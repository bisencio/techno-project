import React, { useState, useRef, useEffect } from 'react';

interface ScriptsDemoProps {
    isActive: boolean;
}

interface Message {
    sender: 'bot' | 'user';
    text: string;
    time?: string;
    quickReplies?: QuickReply[];
    isCard?: boolean;
    cardData?: CardData;
}

interface QuickReply {
    label: string;
    value: string;
}

interface CardData {
    title: string;
    subtitle: string;
    highlight?: string;
    details: string[];
}

export const ScriptsDemo: React.FC<ScriptsDemoProps> = ({ isActive }) => {
    const [messengerMessages, setMessengerMessages] = useState<Message[]>([]);
    const [smsMessages, setSmsMessages] = useState<Message[]>([]);
    const [messengerTyping, setMessengerTyping] = useState(false);
    const [smsTyping, setSmsTyping] = useState(false);
    const [messengerRunning, setMessengerRunning] = useState(false);
    const [smsRunning, setSmsRunning] = useState(false);
    const [messengerCompleted, setMessengerCompleted] = useState(false);
    const [smsCompleted, setSmsCompleted] = useState(false);
    const [activeQuickReplies, setActiveQuickReplies] = useState<QuickReply[] | null>(null);

    const messengerChatRef = useRef<HTMLDivElement>(null);
    const smsChatRef = useRef<HTMLDivElement>(null);

    const messengerData: Message[] = [
        {
            sender: 'bot',
            text: "👋 Magandang araw! Welcome to Barangay San Miguel.\n\nHow can I help you today?",
            time: "9:00 AM",
            quickReplies: [
                { label: "📄 Barangay Clearance", value: "clearance" },
                { label: "🪪 Barangay ID", value: "id" },
                { label: "🏥 Health Appointment", value: "health" },
                { label: "📋 Certificate of Indigency", value: "indigency" }
            ]
        },
        { sender: 'user', text: "📄 Barangay Clearance", time: "9:01 AM" },
        {
            sender: 'bot',
            text: "Great choice! Please select your preferred appointment slot:",
            time: "9:01 AM",
            quickReplies: [
                { label: "Jan 15, 9:00 AM", value: "slot_a" },
                { label: "Jan 15, 2:00 PM", value: "slot_b" },
                { label: "Jan 16, 9:00 AM", value: "slot_c" }
            ]
        },
        { sender: 'user', text: "Jan 15, 9:00 AM", time: "9:02 AM" },
        {
            sender: 'bot',
            text: "Perfect! Just need a few details. What is your full name?",
            time: "9:02 AM"
        },
        { sender: 'user', text: "Juan Dela Cruz", time: "9:03 AM" },
        {
            sender: 'bot',
            text: "Thanks Juan! What's your mobile number?",
            time: "9:03 AM"
        },
        { sender: 'user', text: "09171234567", time: "9:04 AM" },
        {
            sender: 'bot',
            text: "",
            time: "9:04 AM",
            isCard: true,
            cardData: {
                title: "✅ Booking Confirmed!",
                highlight: "BRY-2024-00152",
                subtitle: "Barangay Clearance",
                details: [
                    "📅 January 15, 2024 at 9:00 AM",
                    "📍 Barangay Hall, Window 2",
                    "📎 Please bring a valid ID"
                ]
            }
        }
    ];

    const smsData: Message[] = [
        { sender: 'user', text: "Hi", time: "9:00 AM" },
        {
            sender: 'bot',
            text: "*BARANGAY SAN MIGUEL* 🏛️\n\nHello! What service do you need?\n\n1 - Barangay Clearance\n2 - Barangay ID\n3 - Health Appointment\n4 - Certificate of Indigency\n\n_Reply with the number of your choice._",
            time: "9:00 AM"
        },
        { sender: 'user', text: "1", time: "9:01 AM" },
        {
            sender: 'bot',
            text: "*Barangay Clearance*\n\nPlease select a slot:\n\nA - Jan 15, 9:00 AM\nB - Jan 15, 2:00 PM\nC - Jan 16, 9:00 AM\n\n_Reply with A, B, or C._",
            time: "9:01 AM"
        },
        { sender: 'user', text: "A", time: "9:02 AM" },
        {
            sender: 'bot',
            text: "Great! What is your full name?",
            time: "9:02 AM"
        },
        { sender: 'user', text: "Juan Dela Cruz", time: "9:03 AM" },
        {
            sender: 'bot',
            text: "✅ *CONFIRMED!*\n\n*Ref#: BRY-2024-00152*\n\n📄 Barangay Clearance\n📅 Jan 15, 9:00 AM\n📍 Window 2\n\n_Please bring a valid ID._\n\nSalamat po! 🙏",
            time: "9:03 AM"
        }
    ];

    const messengerPreview: Message[] = [
        {
            sender: 'bot',
            text: "👋 Magandang araw! Welcome to Barangay San Miguel.\n\nHow can I help you today?",
            time: "9:00 AM",
            quickReplies: [
                { label: "📄 Barangay Clearance", value: "clearance" },
                { label: "🪪 Barangay ID", value: "id" },
                { label: "🏥 Health Appointment", value: "health" },
                { label: "📋 Certificate of Indigency", value: "indigency" }
            ]
        }
    ];

    const smsPreview: Message[] = [
        {
            sender: 'bot',
            text: "*BARANGAY SAN MIGUEL* 🏛️\n\nHello! Send *Hi* to get started.\n\nServices available:\n• Barangay Clearance\n• Barangay ID\n• Health Appointment\n• Certificate of Indigency",
            time: "9:00 AM"
        }
    ];

    useEffect(() => {
        if (messengerMessages.length === 0 && !messengerCompleted) {
            setMessengerMessages(messengerPreview);
            setActiveQuickReplies(messengerPreview[0].quickReplies || null);
        }
        if (smsMessages.length === 0 && !smsCompleted) {
            setSmsMessages(smsPreview);
        }
    }, []);

    const runDemo = (
        data: Message[],
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
        setTyping: React.Dispatch<React.SetStateAction<boolean>>,
        setRunning: React.Dispatch<React.SetStateAction<boolean>>,
        setCompleted: React.Dispatch<React.SetStateAction<boolean>>,
        delay: number,
        isMessenger: boolean = false
    ) => {
        setMessages([]);
        setRunning(true);
        setCompleted(false);
        if (isMessenger) setActiveQuickReplies(null);
        let index = 0;

        const showNext = () => {
            if (index >= data.length) {
                setRunning(false);
                setCompleted(true);
                return;
            }

            const nextMessage = data[index];

            if (nextMessage.sender === 'bot') {
                setTyping(true);
                setTimeout(() => {
                    setTyping(false);
                    setMessages(prev => [...prev, nextMessage]);
                    if (isMessenger && nextMessage.quickReplies) {
                        setActiveQuickReplies(nextMessage.quickReplies);
                    } else if (isMessenger) {
                        setActiveQuickReplies(null);
                    }
                    index++;
                    setTimeout(showNext, delay);
                }, 1000);
            } else {
                if (isMessenger) setActiveQuickReplies(null);
                setMessages(prev => [...prev, nextMessage]);
                index++;
                setTimeout(showNext, delay);
            }
        };

        showNext();
    };

    useEffect(() => {
        if (messengerChatRef.current) {
            messengerChatRef.current.scrollTop = messengerChatRef.current.scrollHeight;
        }
    }, [messengerMessages, messengerTyping]);

    useEffect(() => {
        if (smsChatRef.current) {
            smsChatRef.current.scrollTop = smsChatRef.current.scrollHeight;
        }
    }, [smsMessages, smsTyping]);

    return (
        <section className={`section-panel bg-gradient-4 ${isActive ? 'active' : ''}`} id="section-3">
            <div className="bg-pattern"></div>

            <div className="w-full max-w-6xl relative z-10 px-4 pt-16 md:pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 justify-items-center">
                    <div className="fade-item w-full max-w-[340px] flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-4 w-full justify-center lg:justify-start">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                <i className="fab fa-facebook-messenger text-white text-lg"></i>
                            </div>
                            <div>
                                <div className="text-white font-bold">Messenger Bot</div>
                                <div className="text-purple-200 text-xs">Interactive Quick Replies</div>
                            </div>
                        </div>

                        <div className="phone-frame rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-gray-800 bg-gray-800 w-full">
                            <div className="bg-gray-900 h-6 flex items-center justify-center">
                                <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
                            </div>

                            <div className="phone-screen-mask flex flex-col h-[440px] overflow-hidden bg-gray-100">
                                <div className="bg-white px-4 py-1 flex justify-between items-center text-gray-900 text-xs flex-shrink-0">
                                    <span className="font-semibold">9:41</span>
                                    <div className="flex items-center gap-1">
                                        <i className="fas fa-signal text-[10px]"></i>
                                        <i className="fas fa-wifi text-[10px]"></i>
                                        <div className="w-6 h-3 border border-gray-900 rounded-sm relative">
                                            <div className="absolute inset-0.5 bg-gray-900 rounded-sm" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white px-3 py-2.5 flex items-center gap-2 border-b border-gray-200 flex-shrink-0">
                                    <button className="text-blue-500 text-lg w-6 flex-shrink-0">
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <div className="relative flex-shrink-0">
                                        <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                            <i className="fas fa-landmark text-white text-sm"></i>
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-gray-900 font-semibold text-sm truncate">Barangay San Miguel</div>
                                        <div className="text-green-500 text-[10px] font-medium">Active now</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-blue-500 flex-shrink-0">
                                        <i className="fas fa-phone text-base"></i>
                                        <i className="fas fa-video text-base"></i>
                                    </div>
                                </div>

                                <div
                                    ref={messengerChatRef}
                                    className="chat-scroll-area flex-1 overflow-y-auto py-3 px-3 min-h-0"
                                    style={{
                                        background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                    }}
                                >
                                    <div className="flex flex-col gap-1">
                                        {messengerMessages.map((msg, i) => {
                                            const prevMsg = messengerMessages[i - 1];
                                            const nextMsg = messengerMessages[i + 1];
                                            const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender;
                                            const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender;

                                            return (
                                                <MessengerBubble
                                                    key={i}
                                                    message={msg}
                                                    showAvatar={msg.sender === 'bot' && isLastInGroup}
                                                    isFirstInGroup={isFirstInGroup}
                                                    isLastInGroup={isLastInGroup}
                                                />
                                            );
                                        })}
                                        {messengerTyping && <MessengerTypingIndicator />}
                                    </div>

                                    {activeQuickReplies && !messengerTyping && (
                                        <div className="flex flex-wrap gap-2 mt-3 pb-2 pr-2">
                                            {activeQuickReplies.map((reply, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-white border border-blue-500 text-blue-500 rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm hover:bg-blue-50 transition-colors cursor-pointer"
                                                >
                                                    {reply.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white px-3 py-2.5 flex items-center gap-3 border-t border-gray-100 flex-shrink-0">
                                    <div className="flex items-center gap-3 text-blue-500 flex-shrink-0">
                                        <i className="fas fa-circle-plus text-[22px]"></i>
                                        <i className="fas fa-camera text-[18px]"></i>
                                        <i className="fas fa-image text-[18px]"></i>
                                        <i className="fas fa-microphone text-[18px]"></i>
                                    </div>
                                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-400 text-[13px] min-w-0">
                                        Aa
                                    </div>
                                    <i className="fas fa-thumbs-up text-blue-500 text-[22px] flex-shrink-0"></i>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => runDemo(messengerData, setMessengerMessages, setMessengerTyping, setMessengerRunning, setMessengerCompleted, 1200, true)}
                            disabled={messengerRunning}
                            className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium text-sm transition-all shadow-lg hover:shadow-blue-500/25 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                paddingLeft: '1.75rem',
                                paddingRight: '2rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                textShadow: 'none',
                                WebkitFontSmoothing: 'antialiased',
                            }}
                        >
                            <span className="inline-flex items-center justify-center gap-3">
                                {messengerRunning ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Running...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" style={{ marginLeft: '2px' }}>
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        <span>Run Demo</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    <div className="fade-item w-full max-w-[340px] flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-4 w-full justify-center lg:justify-start">
                            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0">
                                <i className="fab fa-whatsapp text-white text-xl"></i>
                            </div>
                            <div>
                                <div className="text-white font-bold">SMS / WhatsApp</div>
                                <div className="text-purple-200 text-xs">Text-Based Booking</div>
                            </div>
                        </div>

                        <div className="phone-frame rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-gray-800 bg-gray-800 w-full">
                            <div className="bg-[#075e54] h-6 flex items-center justify-center">
                                <div className="w-20 h-4 bg-[#064e46] rounded-full"></div>
                            </div>

                            <div className="phone-screen-mask flex flex-col h-[440px] overflow-hidden">
                                <div className="bg-[#075e54] px-4 py-1 flex justify-between items-center text-white text-xs flex-shrink-0">
                                    <span className="font-semibold">9:41</span>
                                    <div className="flex items-center gap-1">
                                        <i className="fas fa-signal text-[10px]"></i>
                                        <i className="fas fa-wifi text-[10px]"></i>
                                        <div className="w-6 h-3 border border-white rounded-sm relative">
                                            <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#075e54] px-3 py-2 flex items-center gap-3 flex-shrink-0">
                                    <button className="text-white text-lg w-5 flex-shrink-0">
                                        <i className="fas fa-arrow-left"></i>
                                    </button>
                                    <div className="relative flex-shrink-0">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                            <i className="fas fa-landmark text-gray-600 text-sm"></i>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-semibold text-sm truncate">Barangay San Miguel</div>
                                        <div className="text-green-200 text-[11px]">online</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-white flex-shrink-0">
                                        <i className="fas fa-video text-base"></i>
                                        <i className="fas fa-phone text-base"></i>
                                        <i className="fas fa-ellipsis-vertical text-base"></i>
                                    </div>
                                </div>

                                <div
                                    ref={smsChatRef}
                                    className="chat-scroll-area flex-1 overflow-y-auto p-3 min-h-0"
                                    style={{
                                        backgroundColor: '#ece5dd',
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8bfb6' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                    }}
                                >
                                    <div className="flex justify-center mb-3">
                                        <div className="bg-[#e1f2fb] text-[#5f6f78] text-[10px] px-3 py-1 rounded-lg shadow-sm font-medium">
                                            TODAY
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {smsMessages.map((msg, i) => (
                                            <WhatsAppBubble key={i} message={msg} />
                                        ))}
                                        {smsTyping && <WhatsAppTypingIndicator />}
                                    </div>
                                </div>

                                <div className="bg-[#f0f2f5] px-2 py-2 flex items-center gap-2 flex-shrink-0">
                                    <i className="fas fa-face-smile text-[#54656f] text-xl flex-shrink-0"></i>
                                    <div className="flex-1 bg-white rounded-full px-4 py-2 text-[#667781] text-xs flex items-center min-w-0 shadow-sm">
                                        <span>Message</span>
                                        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
                                            <i className="fas fa-paperclip text-sm"></i>
                                            <i className="fas fa-camera text-sm"></i>
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 bg-[#00a884] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <i className="fas fa-microphone text-white text-base"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => runDemo(smsData, setSmsMessages, setSmsTyping, setSmsRunning, setSmsCompleted, 1400)}
                            disabled={smsRunning}
                            className="mt-6 bg-[#00a884] hover:bg-[#008f72] text-white font-medium text-sm transition-all shadow-lg hover:shadow-green-500/25 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                paddingLeft: '1.75rem',
                                paddingRight: '2rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                textShadow: 'none',
                                WebkitFontSmoothing: 'antialiased',
                            }}
                        >
                            <span className="inline-flex items-center justify-center gap-3">
                                {smsRunning ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Running...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" style={{ marginLeft: '2px' }}>
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        <span>Run Demo</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface MessengerBubbleProps {
    message: Message;
    showAvatar?: boolean;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
}

const MessengerBubble: React.FC<MessengerBubbleProps> = ({
    message,
    showAvatar = true,
    isFirstInGroup = true,
    isLastInGroup = true
}) => {
    const isUser = message.sender === 'user';

    if (message.isCard && message.cardData) {
        return (
            <div className="flex items-end gap-2 pr-4">
                <div className="w-7 flex-shrink-0">
                    {showAvatar && (
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <i className="fas fa-landmark text-white text-[9px]"></i>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-start" style={{ maxWidth: '80%' }}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2.5">
                            <div className="text-white font-semibold text-[13px]">{message.cardData.title}</div>
                        </div>
                        <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100">
                            <div className="text-[9px] text-blue-600 font-semibold uppercase tracking-wider">Reference Number</div>
                            <div className="text-blue-700 font-bold text-lg font-mono tracking-wide">{message.cardData.highlight}</div>
                        </div>
                        <div className="px-4 py-3">
                            <div className="text-gray-900 font-semibold text-[13px] mb-2">{message.cardData.subtitle}</div>
                            {message.cardData.details.map((detail, i) => (
                                <div key={i} className="text-gray-600 text-[12px] py-0.5 leading-relaxed">{detail}</div>
                            ))}
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 ml-1">{message.time}</div>
                </div>
            </div>
        );
    }

    const getBubbleRadius = () => {
        if (isUser) {
            if (isFirstInGroup && isLastInGroup) return 'rounded-[20px] rounded-br-[4px]';
            if (isFirstInGroup) return 'rounded-[20px] rounded-br-[4px]';
            if (isLastInGroup) return 'rounded-[20px] rounded-tr-[4px] rounded-br-[4px]';
            return 'rounded-[20px] rounded-tr-[4px] rounded-br-[4px]';
        } else {
            if (isFirstInGroup && isLastInGroup) return 'rounded-[20px] rounded-bl-[4px]';
            if (isFirstInGroup) return 'rounded-[20px] rounded-bl-[4px]';
            if (isLastInGroup) return 'rounded-[20px] rounded-tl-[4px] rounded-bl-[4px]';
            return 'rounded-[20px] rounded-tl-[4px] rounded-bl-[4px]';
        }
    };

    return (
        <div
            className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse pl-12 pr-3' : 'flex-row pr-12 pl-0'}`}
            style={{
                marginTop: isFirstInGroup ? '8px' : '2px',
                marginBottom: isLastInGroup ? '0px' : '0px'
            }}
        >
            {!isUser && (
                <div className="w-7 flex-shrink-0 mb-0.5">
                    {showAvatar ? (
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <i className="fas fa-landmark text-white text-[9px]"></i>
                        </div>
                    ) : (
                        <div className="w-7 h-7" />
                    )}
                </div>
            )}

            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`} style={{ maxWidth: '75%' }}>
                <div
                    className={`px-4 py-2.5 text-[13px] leading-[1.4] ${getBubbleRadius()} ${
                        isUser
                            ? 'bg-[#0084ff] text-white'
                            : 'bg-white text-gray-900 shadow-sm'
                    }`}
                    style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                        fontWeight: 400,
                        letterSpacing: '-0.01em',
                    }}
                >
                    {message.text}
                </div>
                {isLastInGroup && (
                    <div className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'mr-1' : 'ml-1'}`}>
                        {message.time}
                    </div>
                )}
            </div>
        </div>
    );
};

const MessengerTypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 pr-12 mt-2">
        <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-landmark text-white text-[9px]"></i>
        </div>
        <div className="bg-white rounded-[20px] rounded-bl-[4px] px-4 py-3 shadow-sm">
            <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    </div>
);

const WhatsAppBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';

    const formatText = (text: string) => {
        const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);
        return parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                return <strong key={i} className="font-bold">{part.slice(1, -1)}</strong>;
            }
            if (part.startsWith('_') && part.endsWith('_')) {
                return <em key={i} className="italic text-gray-500">{part.slice(1, -1)}</em>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className={`flex ${isUser ? 'justify-end pr-2' : 'justify-start pl-2'}`}>
            <div
                className={`relative px-3 py-2 text-[12px] leading-relaxed shadow-sm ${
                    isUser
                        ? 'bg-[#d9fdd3] text-gray-900 rounded-lg rounded-tr-sm'
                        : 'bg-white text-gray-900 rounded-lg rounded-tl-sm'
                }`}
                style={{
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                }}
            >
                <div className="pr-12 pb-0.5 whitespace-pre-wrap">{formatText(message.text)}</div>

                <div className="absolute bottom-1.5 right-2 flex items-center gap-0.5 text-[10px] text-gray-500">
                    <span>{message.time}</span>
                    {isUser && (
                        <svg viewBox="0 0 16 11" height="11" width="16" className="fill-[#53bdeb] ml-0.5">
                            <path d="M11.071 0.653c-0.08-0.068-0.182-0.102-0.304-0.102-0.148 0-0.275 0.059-0.381 0.178l-6.189 6.634-2.406-2.731c-0.093-0.118-0.218-0.178-0.375-0.178-0.148 0-0.275 0.059-0.381 0.178l-0.934 1.061c-0.099 0.118-0.148 0.257-0.148 0.415 0 0.158 0.049 0.297 0.148 0.415l3.786 4.300c0.093 0.118 0.218 0.178 0.375 0.178 0.148 0 0.275-0.054 0.381-0.162l7.292-8.093c0.099-0.118 0.148-0.257 0.148-0.415 0-0.158-0.049-0.292-0.148-0.4l-0.864-1.178z"></path>
                            <path d="M15.071 0.653c-0.08-0.068-0.182-0.102-0.304-0.102-0.148 0-0.275 0.059-0.381 0.178l-6.189 6.634-1.041-1.182c-0.093-0.118-0.218-0.178-0.375-0.178-0.148 0-0.275 0.059-0.381 0.178l-0.934 1.061c-0.099 0.118-0.148 0.257-0.148 0.415 0 0.158 0.049 0.297 0.148 0.415l2.406 2.731c0.093 0.118 0.218 0.178 0.375 0.178 0.148 0 0.275-0.054 0.381-0.162l7.292-8.093c0.099-0.118 0.148-0.257 0.148-0.415 0-0.158-0.049-0.292-0.148-0.4l-0.849-1.158z"></path>
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
};

const WhatsAppTypingIndicator: React.FC = () => (
    <div className="flex justify-start pl-2">
        <div className="bg-white text-gray-900 rounded-lg rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    </div>
);

export default ScriptsDemo;