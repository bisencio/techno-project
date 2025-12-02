import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ScriptsDemoProps {
    isActive: boolean;
}

interface Message {
    sender: 'bot' | 'user';
    text: string;
}

export const ScriptsDemo: React.FC<ScriptsDemoProps> = ({ isActive }) => {
    const [messengerMessages, setMessengerMessages] = useState<Message[]>([]);
    const [smsMessages, setSmsMessages] = useState<Message[]>([]);

    const messengerChatRef = useRef<HTMLDivElement>(null);
    const smsChatRef = useRef<HTMLDivElement>(null);

    const messengerData: Message[] = [
        { sender: 'bot', text: "👋 Magandang araw! Welcome sa Barangay San Miguel Connect.\n\nPaki-type po ang inyong pangalan." },
        { sender: 'user', text: "Juan Dela Cruz" },
        { sender: 'bot', text: "Salamat Juan! 📱 Ano po ang mobile number ninyo?" },
        { sender: 'user', text: "09171234567" },
        { sender: 'bot', text: "✅ Registered!\n\n1️⃣ Barangay Clearance\n2️⃣ Barangay ID\n3️⃣ Health Appointment\n4️⃣ Certificate of Indigency" },
        { sender: 'user', text: "1" },
        { sender: 'bot', text: "📅 Available Slots:\nA - Jan 15, 9AM\nB - Jan 15, 2PM\nC - Jan 16, 9AM" },
        { sender: 'user', text: "A" },
        { sender: 'bot', text: "🎉 CONFIRMED!\n\n📋 Ref#: BRY-2024-00152\n📌 Barangay Clearance\n📅 Jan 15, 9:00 AM\n📍 Window 2\n\nSee you po! 🙏" }
    ];

    const smsData: Message[] = [
        { sender: 'user', text: "BOOK" },
        { sender: 'bot', text: "BARANGAY SAN MIGUEL\n1-Clearance\n2-Brgy ID\n3-Health\n4-Indigency\n\nReply: [#] [Name]" },
        { sender: 'user', text: "1 Juan Dela Cruz" },
        { sender: 'bot', text: "Slots:\nA-Jan15 9AM\nB-Jan15 2PM\nC-Jan16 9AM\n\nReply letter." },
        { sender: 'user', text: "A" },
        { sender: 'bot', text: "CONFIRMED!\nRef#: BRY-2024-00152\nJan 15, 9AM\nWindow 2\n\nBring ID. Salamat!" }
    ];

    const runDemo = (
        data: Message[],
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
        delay: number
    ) => {
        setMessages([]);
        let index = 0;

        const showNext = () => {
            if (index >= data.length) return;

            const nextMessage = data[index];
            setMessages(prev => [...prev, nextMessage]);
            index++;
            setTimeout(showNext, delay);
        };

        showNext();
    };

    // Auto-scroll
    useEffect(() => {
        if (messengerChatRef.current) {
            messengerChatRef.current.scrollTop = messengerChatRef.current.scrollHeight;
        }
    }, [messengerMessages]);

    useEffect(() => {
        if (smsChatRef.current) {
            smsChatRef.current.scrollTop = smsChatRef.current.scrollHeight;
        }
    }, [smsMessages]);

    return (
        <section className={`section-panel bg-gradient-4 ${isActive ? 'active' : ''}`} id="section-3">
            <div className="bg-pattern"></div>

            <div className="w-full max-w-6xl relative z-10">
                <h2 className="fade-item text-4xl font-bold text-white text-center mb-8">
                    <i className="fas fa-comments text-purple-300 mr-3"></i>Conversation Scripts
                </h2>

                <div className="grid grid-cols-2 gap-8">
                    {/* Messenger Demo */}
                    <div className="fade-item">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <i className="fab fa-facebook-messenger text-white"></i>
                            </div>
                            <div>
                                <div className="text-white font-bold">Messenger Bot</div>
                                <div className="text-purple-200 text-xs">Interactive Chatbot</div>
                            </div>
                        </div>
                        <div className="chat-container">
                            <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fas fa-landmark text-white text-sm"></i>
                                </div>
                                <span className="text-white font-medium text-sm">Barangay San Miguel</span>
                            </div>
                            <div ref={messengerChatRef} className="chat-messages">
                                {messengerMessages.map((msg, i) => (
                                    <div key={i} className={`chat-bubble flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                                        <div className={`${msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-600'} text-white px-3 py-2 rounded-xl max-w-[80%] text-xs whitespace-pre-line`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-black/20 backdrop-blur-sm border-t border-white/10">
                                <Button
                                    onClick={() => runDemo(messengerData, setMessengerMessages, 1000)}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-all shadow-lg hover:shadow-blue-500/25"
                                >
                                    <i className="fas fa-play mr-2"></i>Run Demo
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* SMS Demo */}
                    <div className="fade-item">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                <i className="fas fa-sms text-white"></i>
                            </div>
                            <div>
                                <div className="text-white font-bold">SMS Hotline</div>
                                <div className="text-purple-200 text-xs">Text-Based Booking</div>
                            </div>
                        </div>
                        <div className="chat-container shadow-2xl" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}>
                            <div className="bg-green-600 px-4 py-3 flex items-center gap-3 shadow-md">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fas fa-phone text-white text-sm"></i>
                                </div>
                                <span className="text-white font-medium text-sm">0917-BRY-BOOK</span>
                            </div>
                            <div ref={smsChatRef} className="chat-messages scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {smsMessages.map((msg, i) => (
                                    <div key={i} className={`chat-bubble flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                                        <div className={`${msg.sender === 'user' ? 'bg-green-500' : 'bg-gray-600'} text-white px-3 py-2 rounded-xl max-w-[80%] text-xs whitespace-pre-line shadow-sm`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-black/20 backdrop-blur-sm border-t border-white/10">
                                <Button
                                    onClick={() => runDemo(smsData, setSmsMessages, 1200)}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-all shadow-lg hover:shadow-green-500/25"
                                >
                                    <i className="fas fa-play mr-2"></i>Run Demo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Script Templates */}
                <div className="fade-item grid grid-cols-4 gap-4 mt-6">
                    <ScriptCard icon="fas fa-hand-wave" color="text-yellow-400" title="Greeting" />
                    <ScriptCard icon="fas fa-list-check" color="text-blue-400" title="Service Menu" />
                    <ScriptCard icon="fas fa-circle-check" color="text-green-400" title="Confirmation" />
                    <ScriptCard icon="fas fa-bell" color="text-amber-400" title="Queue Alert" />
                </div>
            </div>
        </section>
    );
};

const ScriptCard: React.FC<{ icon: string; color: string; title: string }> = ({ icon, color, title }) => (
    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
        <i className={`${icon} ${color} text-2xl mb-2`}></i>
        <div className="text-white text-sm font-medium">{title}</div>
    </div>
);