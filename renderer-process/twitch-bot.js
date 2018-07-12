const tmi = require('tmi.js')

let commandPrefix = '!'

// Possibly make this a function that accepts the data in a form
let opts = {
    identity: {
        username: 'Caster_Bot',
        password: 'oauth:1lj5phoisvublum26dxx1cbl1xyg4y',
    },
    channels: [
        'muppins'
    ]
}

let knownCommands = {
    team,
    teams,
}

/*
function echo(target, context, params) {
    // if there's something to echo:
    if (params.includes('house') || params.includes('clean')) {
        const msg = "Did someone say a CLEAN HOUSE!?!"
        sendMessage(target, context, msg)
    } else {
        console.log('* Nothing to echo')
    }
}
*/

function team(target, context, params) {
    if (params.length) {
        const vote = params.join('').toUpperCase()
        let idReg = new XMLHttpRequest();
        idReg.open("GET", "https://powerful-gorge-93867.herokuapp.com/api/v1/gameid", false)
        idReg.send(null)
        gameid = JSON.parse(idReg.responseText)
        if (idReg.status == 200){
            let vReq = new XMLHttpRequest();
            vReq.open(
                "POST",
                "https://powerful-gorge-93867.herokuapp.com/api/v1/teamvotes/" + gameid.game_id,
                false)
            vReq.setRequestHeader('Content-type', 'application/json')
            let params = {
                username: context.username,
                vote: vote
            }
            vReq.send(JSON.stringify(params))
        } else {
            console.log(idReg.status);
        }
    }
}

function teams(target, context, params) {
    // if there's something to echo:
    if (params.length === 0) {
        let idReg = new XMLHttpRequest();
        idReg.open("GET", "https://powerful-gorge-93867.herokuapp.com/api/v1/gameid", false)
        idReg.send(null)
        const game = JSON.parse(idReg.responseText)
        if (game.game_started) {
            msg = `The current teams playing are ${game.blue_team} on the Blue Team and 
            ${game.red_team} on the Red Team!`
        } else {
            msg = 'There are currently no teams playing or registered, check back later!'
        }
        sendMessage(target, context, msg)
    } else {
        console.log('* Nothing to echo')
    }
}


// Helper function to send the correct type of message:
function sendMessage(target, context, message) {
    if (context['message-type'] === 'whisper') {
        client.whisper(target, message)
    } else {
        client.say(target, message)
    }
}

// Creates client with the selected options
let client = new tmi.client(opts)

const connectBot = () => {
    // Register our event handlers
    client.on('message', onMessageHandler)
    client.on('connected', onConnectedHandler)
    client.on('disconnected', onDisconnectedHandler)

    // Connect to Twitch:
    client.connect()
}

const disconnectBot = () => {
    client.disconnect().then(function (data) {
        console.log(data);
    }).catch(function (err) {
        console.log(err);
    });
}

const startGame = () => {
    let gReq = new XMLHttpRequest();
    bTeam = document.getElementById('blue_team');
    rTeam = document.getElementById('red_team');
    gReq.open(
        "POST",
        "https://powerful-gorge-93867.herokuapp.com/api/v1/startgame",
        false)
    gReq.setRequestHeader('Content-type', 'application/json')
    let params = {
        blue_team: bTeam.value.replace(/\s/g,'').toUpperCase(),
        red_team: rTeam.value.replace(/\s/g,'').toUpperCase()
    }
    gReq.send(JSON.stringify(params))
    console.log(gReq.status)
}

const endGame = () => {
    let gReq = new XMLHttpRequest();
    gReq.open("GET", "https://powerful-gorge-93867.herokuapp.com/api/v1/endgame", false)
    gReq.send(null)
    console.log(gReq.status)
    if (gReq.status == 200) {
        document.getElementById('blue_team').value = '';
        document.getElementById('red_team').value = '' ; 
    }
}

// Event Listeners for bot
const connectBotButton = document.getElementById('connect');
const disconnectBotButton = document.getElementById('disconnect');
const startGameButton = document.getElementById('startgame');
const endGameButton = document.getElementById('endgame');
connectBotButton.addEventListener('click', () => connectBot());
disconnectBotButton.addEventListener('click', () => disconnectBot());
startGameButton.addEventListener('click', () => startGame());
endGameButton.addEventListener('click', () => endGame());


// Called every time a message comes in:
function onMessageHandler(target, context, msg, self) {
    if (self) { return } // Ignore messagges from the bot

    // This isn't a command since it has no prefix:
    if (msg.substr(0, 1) !== commandPrefix) {
        if (msg.includes('house') || msg.includes('clean')) {
            msg = "Did someone say a CLEAN HOUSE!?!"
            sendMessage(target, context, msg)
        } else if (msg.includes('vote')){
            msg = "You can vote for the team you think will win by using the \"team! \" command followed by the team name at anytime!"
            sendMessage(target, context, msg)
        }
        console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
        return
    }

    // Split the message into individual words
    const parse = msg.slice(1).split(' ')
    // The command name is the first (0th) one:
    const commandName = parse[0]
    // The rest (if any) are the parameters
    const params = parse.splice(1)

    // If the command is known, execute it
    if (commandName in knownCommands) {
        // Retrieve the function by its name
        const command = knownCommands[commandName]
        // Then call the command with parameters
        command(target, context, params)
        console.log(` Executed ${commandName} command for ${context.username}, params were ${params}`)
    } else {
       console.log(`* Unknown command ${commandName} from ${context.username}`)
    }
}


// Called everytime the bot connects to Twitch chat:
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler(reason) {
    console.log(`Womp womp, disconnected: ${reason}`)
}
