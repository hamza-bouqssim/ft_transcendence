import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchNotificationThunk } from '../store/notificationSlice';
import { NotificationTypes } from '../utils/types';
import { Conversation, ConversationSideBarContainer, ConversationSideBarItem } from '../utils/styles';
import Image from 'next/image';

const NotificationComponent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { notification, status, error } = useSelector((state:any) => state.notification);

    console.log("notification", notification);
    useEffect(() => {
        dispatch(fetchNotificationThunk());
      }, [dispatch]);

      return (
        <div className='absolute top-15 right-5 z-50 bg-[#ffffff] w-[500px] h-[500px]'>
            <ConversationSideBarContainer>
                {notification.map(function(elem: NotificationTypes) {
                    return (
                        <ConversationSideBarItem key={elem.id}>
                            {/* Replace {} with a valid image source */}
                            <Image
                                src={elem.image_content} // You need to provide a valid source for the Image component
                                className="h-14 w-14 rounded-[50%] bg-black"
                                alt="Description of the image"
                                width={60}
                                height={60}
                            />

                            <div>
                                <span className="ConversationName">{elem.content}</span>
                            </div>
                        </ConversationSideBarItem>
                    );
                })}
            </ConversationSideBarContainer>
        </div>
    );
}

export default NotificationComponent
