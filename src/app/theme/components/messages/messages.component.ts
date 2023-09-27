import { Component, ViewEncapsulation } from '@angular/core';
import { MessagesService } from './messages.service';
import { Message, Task } from './messages.service';

@Component({
    selector: 'az-messages',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./messages.component.scss'],
    templateUrl: './messages.component.html',
    providers: [MessagesService]
})

export class MessagesComponent{     
    public messages: Array<Message>;
    public notifications: Array<any>;
    public tasks: Array<Task>;

    constructor (private _messagesService: MessagesService){
        this.messages = _messagesService.getMessages();
        this.notifications = _messagesService.getNotifications();
        this.tasks = _messagesService.getTasks();
    }

}