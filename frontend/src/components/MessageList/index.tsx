import styles from './styles.module.scss';

import logoImg from '../../assets/logo.svg';
import io from 'socket.io-client';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const socket = io('http://localhost:4000');

const messageQueue: Message[] = [];

socket.on('new_message', (newMessage: Message) => {
    messageQueue.push(newMessage)
});

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setInterval(() => {
            if(messageQueue.length > 0) {
                setMessages(prevState => [
                    messageQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean));

                messageQueue.shift();
            }
        }, 3000);
    }, []);
    
    useEffect(() => {
        api.get<Message[]>('/messages/last').then(res => {
            setMessages(res.data);
        });
    }, [])
    
    return (
        <div className={ styles.messageListWrapper }>
            <img src={ logoImg } alt="DoWhile 2021" />

            <ul className={ styles.messageList }>
                { messages.map(message => (
                    <li key={ message.id } className={ styles.message }>
                        <p className={ styles.messageContent }>
                            { message.text }
                        </p>
                        <div className={ styles.messageUser }>
                            <div className={ styles.userImage }>
                                <img src={ message.user.avatar_url } alt="Bruno Vinicius" />
                            </div>
                            <span>{ message.user.name }</span>
                        </div>
                    </li>
                )) }
            </ul>
        </div>
    );
}