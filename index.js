import React from 'react';
import firebase from './firebase/firebase';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  VrButton,
} from 'react-360';

export default class chat_test extends React.Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
      userName: '',
      messageDetail: [],
      userArray: [],
      userInput: [],
    }
  }

  componentDidMount = () => {
    const chatrooms = firebase.database().ref('chatrooms');

    chatrooms.on('value', (chatroom) => {
      const chatrooms = chatroom.val();
      const chatroomPush = chatrooms['publicRoom'];
      let messageArray = [];
      for (let message in chatroomPush) {
        messageArray.push(chatroomPush[message])
      }
      // when chatroom changes, push the entire chatroom message to state

      this.setState({
        messageList: messageArray,
        userName: '',

      })


    })
  }

  handleChange = (e) => {
    const inputEvent = e.nativeEvent.inputEvent;
    // if not a click
    let cleanLetter = [];
    let currentWord = this.state.userInput
    console.log(inputEvent.button)
    // use - as a backspace
    if (inputEvent.button === 32) {
      cleanLetter.unshift('-')
    }
    else if (inputEvent.button === 13) {
      cleanLetter.push('')
    }

    else if (inputEvent.button === 8) {
      cleanLetter.push('')
    }

    else if (inputEvent.button > 0) {
      cleanLetter.unshift(String.fromCharCode(inputEvent.button))
    } else {
      cleanLetter.push('')
    }

    // get rid of double press as keyboard goes up and down
    if (inputEvent.action === 'down') {
      if (inputEvent.button === 8) {
        currentWord.pop()
        this.setState({
          userInput: currentWord,
        })
      } else if (inputEvent.button === 13) {
        this.handleSubmit();

      } else {
        currentWord.push(cleanLetter[0])
        this.setState({
          userInput: currentWord,
        })
      }


    }



  }

  handleSubmit = (e) => {
    // clean the userInput ready to upload to firebase
    let splitUserInput = this.state.userInput.join();
    const splitUserInputAgain = splitUserInput.replace(/,/g, '');
    console.log(splitUserInputAgain);
    const chatrooms = firebase.database().ref('chatrooms');
    const enqueuedMessage = splitUserInputAgain;
    const currentTime = Date(Date.now()).toString();
    const user = 'vr-user'

    const messageObject = {
      userID: 'vr-user',
      userMessage: enqueuedMessage,
      currentTime: currentTime,
      userFirebaseKey: '',
    }


    if (enqueuedMessage) {
      // store the pushID given to us from firebase
      const pushID = chatrooms.child('publicRoom').push(messageObject);
      // update the firebase key with variable pushID
      messageObject.userFirebaseKey = pushID.key;
      chatrooms.child('publicRoom').child(pushID.key).update(messageObject);

      this.setState({
        userInput: [],
      })
    }




  }

  render() {
    console.log(this.state.userInput)
    return (

      <View style={styles.panel}>
        <View style={styles.greetingBox}>
          <Text style={styles.greeting}>
            Welcome to Chattr3
          </Text>
          {
            this.state.messageList.map((message) => {
              return (
                <Text style={styles.greeting2}>{`${message.userID}`}: {`${message.userMessage}`}
                </Text>
              )
            })
          }

        </View>
        <View style={styles.greetingBox2} onInput={this.handleChange}>
          {

            this.state.userInput.map((item) => {
              return (
                <Text style={styles.inputText}>{item}</Text>
              )
            })
          }

        </View>
        <VrButton style={styles.submitButton} value='submitButton' onClick={this.handleSubmit}>
          <Text>Submit Message</Text>
        </VrButton>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  panel: {
    // Fill the entire surface
    width: 1000,
    height: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingBox: {
    padding: 20,
    backgroundColor: '#000000',
    borderColor: '#639dda',
    borderWidth: 2,
    width: 800,
    height: 400,
  },
  greetingBox2: {
    padding: 20,
    backgroundColor: '#000000',
    borderColor: '#639dda',
    borderWidth: 2,
    width: 800,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  greeting: {
    fontSize: 30,
  },
  greeting2: {
    fontSize: 20,
  },
  submitButton: {
    borderColor: '#639dda',
    borderWidth: 2,
    padding: 20,
    width: 800,
    height: 50,
  },

  // inputText: {
  //   display: 'in-line',
  // },
});

AppRegistry.registerComponent('chat_test', () => chat_test);
