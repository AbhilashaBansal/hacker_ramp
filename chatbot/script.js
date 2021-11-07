onload = function(){
    // outputs a javascript object from the parsed json

        let chat = {
            messageToSend: '',
            messageResponses: [
                'Why did the web developer leave the restaurant? Because of the table layout.',
                'How do you comfort a JavaScript bug? You console it.',
                'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
                'What is the most used language in programming? Profanity.',
                'What is the object-oriented way to become wealthy? Inheritance.',
                'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
            ],
            init: async function() {
                this.chatTree = new ChatTree();
                await this.chatTree.init();
                this.cacheDOM();
                this.bindEvents();
                await this.render();
            },
            cacheDOM: function() {
                this.$chatHistory = $('.chat-history');
                this.$button = $('button');
                this.$textarea = $('#message-to-send');
                this.$chatHistoryList =  this.$chatHistory.find('ul');
            },
            bindEvents: function() {
                this.$button.on('click', this.addMessage.bind(this));
                this.$textarea.on('keyup', this.addMessageEnter.bind(this));
            },
            render: async function() {
                this.scrollToBottom();
                if (this.messageToSend.trim() !== '') {
                    let template = Handlebars.compile( $("#message-template").html());
                    let context = {
                        messageOutput: this.messageToSend,
                        time: this.getCurrentTime()
                    };

                    this.input = this.messageToSend;
                    this.$chatHistoryList.append(template(context));
                    this.scrollToBottom();
                    this.$textarea.val('');

                    // responses
                    let templateResponse = Handlebars.compile( $("#message-response-template").html());
                    let contextResponse = {
                        response: await this.chatTree.getMessage(this.input),
                        time: this.getCurrentTime()
                    };
                    if(contextResponse["response"]=="Bye, have fun ..."){
                        await this.chatTree.init();
                    }

                    setTimeout(function() {
                        this.$chatHistoryList.append(templateResponse(contextResponse));
                        this.scrollToBottom();
                    }.bind(this), 1000);

                }

            },

            addMessage: function() {
                this.messageToSend = this.$textarea.val();
                this.render();
            },
            addMessageEnter: function(event) {
                // enter was pressed
                if (event.keyCode === 13) {
                    this.addMessage();
                }
            },
            scrollToBottom: function() {
                this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
            },
            getCurrentTime: function() {
                return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
            }
        };

        chat.init();
};

class ChatTree {

    constructor() {
    }

    async init(){
        const data = await this.reset();
        this.chat_tree = data;
        this.firstMsg = true;
        console.log("inside done");
        // return "Chat has now been terminated. Send hi to begin chat again !";
    }

    async reset(){
        const response = await fetch('chat_tree.json');
        const jsonResponse = await response.json();
        return jsonResponse;
    }

    end(){

    }

    async getMessage(input){
        let resp = "";

        if(this.firstMsg===true) {
            this.firstMsg = false;
            resp += "Hi, welcome to our store. Hope you're having a good time. <br>";
        } 
        else {
            if(parseInt(input)-1===this.chat_tree['children'].length){
                // this.init();
                return "Bye, have fun ...";
            }

            if(isNaN(parseInt(input)) || parseInt(input)<=0 || parseInt(input) > this.chat_tree['children'].length+1)
                return "I'm not sure I can help you with that...";
            
            this.chat_tree = this.chat_tree['children'][parseInt(input)-1];
        }

        if("message" in this.chat_tree){
            let data = this.chat_tree['message'];
            resp += data;
            resp += "<br><br>Please input 1/ 2/ 3/ 4/ 5 again as per your wish, to talk more...";
            // return this.init();
            const data2 = await this.reset();
            this.chat_tree = data2;
        } 
        else {
            for (let i in this.chat_tree['child_msg']) {
                resp += String(parseInt(i) + 1) + ". " + this.chat_tree['child_msg'][parseInt(i)] + "<br>";
            }
        }
        return resp;
    }
}