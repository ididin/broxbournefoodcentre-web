'use client';

import { useState, useEffect } from 'react';
import { Mail, MailOpen } from 'lucide-react';

type Message = {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    isRead: boolean;
    createdAt: string;
};

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const res = await fetch('/api/admin/messages');
        const data = await res.json();
        setMessages(data);
    };

    const toggleReadStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setMessages(messages.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m));

        await fetch('/api/admin/messages', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, isRead: !currentStatus })
        });
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Incoming Messages</h1>
                <p className="text-gray-500 text-sm mt-1">Manage contact requests and messages from visitors.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-12">Status</th>
                                <th className="px-6 py-4 font-semibold">Sender</th>
                                <th className="px-6 py-4 font-semibold">Subject</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {messages.map((msg) => (
                                <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${!msg.isRead ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        {msg.isRead ? <MailOpen className="h-5 w-5 text-gray-400" /> : <Mail className="h-5 w-5 text-blue-600" />}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`font-medium ${!msg.isRead ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{msg.name}</div>
                                        <div className="text-gray-500 text-xs">{msg.email}</div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">
                                        <div className={`font-medium ${!msg.isRead ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{msg.subject || 'No Subject'}</div>
                                        <div className="text-gray-500 text-xs truncate" title={msg.message}>{msg.message}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                                            className="px-3 py-1 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            {msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No messages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
