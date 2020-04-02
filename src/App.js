import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import socket io client
import socketIOClient from "socket.io-client";

class App extends Component {
    constructor() {
        super();
        this.state = {
            response: false,
            // endpoint: "http://54.67.14.97:4001",
            endpoint: "http://40.113.20.144:4001",
            avaterClient: "https://i.imgur.com/DY6gND0.png",
            avaterBot: "https://i.imgur.com/HYcn9xO.png",
            text: "",
            conversation: []
        };
    }
    componentDidMount() {
        const { endpoint } = this.state;
        this.socket = socketIOClient(endpoint);
        this.socket.on("message", data => this.setState({ conversation: [...this.state.conversation, {direction: 'other', time: new Date().getTime(), context: data.queryResult.fulfillmentText  }] }));
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    handleTextInput(event) {
        this.setState({text: event.target.value});
        if(event.keyCode === 13 && this.state.text){
            //get text and current time and set direction of text.
            const message = {direction: "self", time: new Date().getTime(), context: this.state.text};
            this.socket.emit("clientRequest", message.context);
            event.target.value = "";
            this.setState({conversation: [...this.state.conversation, message], text: ""});
            //emit chat message to the server
        };
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView()
    }

    render() {
      const { conversation } = this.state;
      return (
            <div className="App">
              <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">No Name Bot (IMTA)</h1>
              </header>
              <p className="App-intro">
                  To get started, click on the Assistant button at the bottom of the page.
              </p>
              <ol className="chat">
                  {conversation.map((x) => {
                      return(
                          <li className={x.direction} key={x.time}>
                              <div className="avatar"><img  alt="sender Avatar" src={x.direction === "self" ?  this.state.avaterClient : this.state.avaterBot} draggable="false"/></div>
                              <div className="msg">
                                  <p>{x.context}</p>
                                  {/*<emoji className="books"/>*/}
                                  <time>{x.time}</time>
                              </div>
                          </li>
                      )
                  })}
              </ol>
              <input className="textarea" type="text" placeholder="Type here!" value={this.state.value} onKeyUp={(e) => {this.handleTextInput(e)}}/><div className="emojis"></div>
                <div style={{ float:"left", clear: "both" }}
                     ref={(el) => { this.messagesEnd = el; }}>
                </div>
          </div>


      );
    }
}

export default App;
