const socket=io();

const clientstotal=document.getElementById('client-total')

const messageContainer=document.getElementById('message-container')
const nameInput=document.getElementById('name-input')
const messageForm=document.getElementById('message-form')
const messageInput=document.getElementById('message-input')


// event handler for total clients event
socket.on('clients-total',(data)=>{
    // console.log(data)
    clientstotal.innerText=`Total clients: ${data}`
})


messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
  })

// for sending a message
function sendMessage(){
    if (messageInput.value==='') return
    // console.log(messageInput.value)
    const data={
        name:nameInput.value,
        message:messageInput.value,
        datetime:new Date()
    }

    socket.emit('message',data)
    addMessageToUi(true,data)
    messageInput.value=''
}

// for recieving a message
socket.on('chat-message', (data)=>{
    // console.log(data)
    addMessageToUi(false,data)

})

function addMessageToUi(isOwnMessage, data){
    clearfeedback()
    const element=`
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
    <p class="message">
      ${data.message}
      <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
    </p>
  </li>
  `

  messageContainer.innerHTML +=element
  scrollToBottom()

}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}


messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:''
    })
})


socket.on('feedback',(data)=>{
    clearfeedback()
    const element=`
    <li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
  </li>`

  messageContainer.innerHTML+=element
})

function clearfeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    });
}