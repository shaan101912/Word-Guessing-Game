import React, { Component } from 'react';
import { View, WebView, StatusBar } from 'react-native';

export default class App extends Component {
    render() {

        var webViewCode = `
<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="text/javascript" src="https://static.codehs.com/gulp/90383397a2266c189a7fe6dc323191532ef1542a/chs-js-lib/chs.js"></script>

<style>
    body, html {
        margin: 0;
        padding: 0;
    }
    canvas {
        margin: 0px;
        padding: 0px;
        display: inline-block;
        vertical-align: top;
    }
    #btn-container {
        text-align: center;
        padding-top: 10px;
    }
    #btn-play {
        background-color: #8cc63e;
    }
    #btn-stop {
        background-color: #de5844;
    }
    .glyphicon {
        margin-top: -3px;
        color: #FFFFFF;
    }
</style>
</head>

<body>
    <div id="canvas-container" style="margin: 0 auto; ">
        <canvas
        id="game"
        width="400"
        height="480"
        class="codehs-editor-canvas"
        style="width: 100%; height: 100%; margin: 0 auto;"
        ></canvas>
    </div>
    <div id="console"></div>
    <div id="btn-container">
        <button class="btn btn-main btn-lg" id="btn-play" onclick='stopProgram(); runProgram();'><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>
        <button class="btn btn-main btn-lg" id="btn-stop" onclick='stopProgram();'><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button>
    </div>

<script>
    var console = {};
    console.log = function(msg){
        $("#console").html($("#console").html() + "     " + msg);
    };

    var runProgram = function() {
        //Array that stores the word that has to be guessed, broken down by each letter
var word = [];
//Array that holds the locations the guessed letter is in the word
var locations = [];
//Holds the Word in the form of ? for letters that have not been guessed yet.
var gameword = [];
//Variable that holds the amount of guesses left
var guesses_left;
//The variable that contains the "guesses left" that appears on the canvas
var guesses_left_visual;
//Variable that contains the letters that have been guessed already
var guessed = [];
//Boolean that declares if the player won
var win = false;
//The default difficulty is set to easy
var word_difficulty_easy = true;
//The list of 1000 easy words that will be chosen from (vocabulary.com for the words)
var word_bank_easy = [
"ability","able","about","above","accept","according","account" , "across" , "act" , "action" , "activity" , "actually" , "add" , "address" , "administration" , "admit" , "adult" , "affect" , "after" , "again" , "against" , "age" , "agency" , "agent" , "ago" , "agree" , "agreement" , "ahead" , "air" , "all" , 
"allow" , "almost" , "alone" , "along" , "already" , "also" , "although" , "always" , "American" , "among" , "amount" , "analysis" , "and" , "animal" , "another" , "answer" , "any" , "anyone" , "anything" , "appear" , "apply" , "approach" , "area" , "argue" , "arm" , "around" , "arrive" , "art" , "article" , 
"artist" , "as" , "ask" , "assume" , "at" , "attack" , "attention" , "attorney" , "audience" , "author" , "authority" , "available" , "avoid" , "away" , "baby" , "back" , "bad" , "bag", "ball" , "bank" , "bar" , "base" , "be" , "beat" , "beautiful" , "because" , "become" , "bed" , "before" , "begin" , 
"behavior" , "behind" , "believe" , "benefit" , "best" , "better" , "between" , "beyond" , "big" , "bill" , "billion" , "bit" , "black" , "blood" , "blue" , "board" , "body" , "book" , "born" , 
"both" , "box" , "boy" , "break" , "bring" , "brother" , "budget" , "build" , "building" , "business" , "but" , "buy" , "by" , "call" , "camera" , "campaign" , "can" , "cancer" , "candidate" , "capital" , "car" , "card" , "care" , "career" , "carry" , "case" , "catch" , "cause" , "cell" , "center" , 
"central" , "century" , "certain" , "certainly" , "chair" , "challenge" , "chance" , "change" , "character" , "charge" , "check" , "child" , "choice" , "choose" , "church" , "citizen" , "city" , "civil" , "claim" , "class" , "clear" , "clearly" , "close" , "coach" , "cold" , "collection" , "college" , 
"color" , "come" , "commercial" , "common" , "community" , "company" , "compare" , "computer" , "concern" , "condition" , "conference" , "Congress" , "consider" , "consumer" , "contain" , "continue" , "control" , "cost" , "could" , "country" , "couple" , "course" , "court" , "cover" , "create" , "crime" , 
"cultural" , "culture" , "cup" , "current" , "customer" , "cut" , "dark" , "data" , "daughter" , "day" , "dead" , "deal" , "death" , "debate" , "decade" , "decide" , "decision" , "deep" , "defense" , "degree" , "Democrat" , "democratic" , "describe" , "design" , "despite" , "detail" , "determine" , "develop" , 
"development" , "die" , "difference" , "different" , "difficult" , "dinner" , "direction" , "director" , "discover" , "discuss" , "discussion" , "disease" , "do" , "doctor" , "dog" , "door" , "down" , "draw" , "dream" , "drive" , "drop" , "drug" , "during" , "each" , "early" , "east" , "easy" , "eat" , "economic" , 
"economy","edge" , "education" , "effect" , "effort" , "eight" , "either" , "election" , "else" , "employee" , "end" , "energy" , "enjoy" , "enough" , "enter" , "entire" , "environment" , "environmental" , "especially" , "establish" , "even" , "evening" , "event" , "ever" , "every" , 
"everybody" , "everyone" , "everything" , "evidence" , "exactly" , "example" , "executive" , "exist" , "expect" , "experience" , "expert" , "explain" , "eye" , "face" , "fact" , "factor" , "fail" , "fall" , "family" , "far" , "fast" , "father" , "fear" , "federal" , "feel" , "feeling" , "few" , "field" , 
"fight" , "figure" , "fill" , "film" , "final" , "finally" , "financial" , "find" , "fine" , "finger" , "finish" , "fire" , "firm" , "first" , "fish" , "five" , "floor" , "fly" , "focus" , "follow" , "food" , "foot" , "for" , "force" , "foreign" , "forget" , "form" , "former" , "forward" , "four" , "free" , 
"friend" , "from" , "front" , "full" , "fund" , "future" , "game" , "garden" , "gas" , "general" , "generation" , "get" , "girl" , "give" , "glass" , "go" , "goal" , "good" , "government" , "great" , "green" , "ground" , "group" , "grow" , 
"growth" , "guess" , "gun" , "guy" , "hair" , "half" , "hand" , "hang" , "happen" , "happy" , "hard" , "have" , "he" , "head" , "health" , "hear" , "heart" , "heat" , "heavy" , "help" , "her" , "here" , "herself" , "high" , "him" , "himself" , "his" , "history" , "hit" , "hold" , "home" , "hope" , 
"hospital" , "hot" , "hotel" , "hour" , "house" , "how" , "however" , "huge" , "human" , "hundred" , "husband" , "I" , "idea" , "identify" , "if" , "image" , "imagine" , "impact" , "important" , "improve" , "in" , "include" , "including" , "increase" , "indeed" , "indicate" , "individual" , "industry" , 
"information" , "inside" , "instead" , "institution" , "interest" , "interesting" , "international" , "interview" , "into" , "investment" , "involve" , "issue" , "it" , "item" , "its" , "itself" , "job" , "join" , "just" , "keep" , "key" , "kid" , "kill" , 
"kind" , "kitchen" , "know" , "knowledge" , "land" , "language" , "large" , "last" , "late" , "later" , "laugh" , "law" , "lawyer" , "lay" , "lead" , "leader" , "learn" , "least" , "leave" , "left" , "leg" , "legal" , "less" , "let" , "letter" , "level" , "lie" , "life" , "light" , "like" , "likely" , 
"line" , "list" , "listen" , "little" , "live" , "local" , "long" , "look" , "lose" , "loss" , "lot" , "love" , "low" , "machine" , "magazine" , "main" , "maintain" , "major" , "majority" , "make" , "man" , "manage" , "management" , "manager" , "many" , "market" , "marriage" , "material" , "matter" , 
"may" , "maybe" , "me" , "mean" , "measure" , "media" , "medical" , "meet" , "meeting" , "member" , "memory" , "mention" , "message" , "method" , "middle" , "might" , "military" , "million" , "mind" , "minute" , "miss" , "mission" , "model" , "modern" , "moment" , 
"money" , "month" , "more" , "morning" , "most" , "mother" , "mouth" , "move" , "movement" , "movie" , "Mr" , "Mrs" , "much" , "music" , "must" , "my" , "myself" , "name" , "nation" , "national" , "natural" , "nature" , "near" , "nearly" , "necessary" , "need" , "network" , "never" , "new" , "news" , "newspaper" ,
"next" , "nice" , "night" , "no" , "none" , "nor" , "north" , "not" , "note" , "nothing" , "notice" , "now" , "number" , "occur" , "of" , "off" , "offer" , "office" , "officer" , "official" , "often" , "oh" , "oil" , "ok" , "old" , "on" , "once" , "one" , "only" , "onto" , "open" , "operation" , "opportunity" , 
"option" , "or" , "order" , "organization" , "other" , "others" , "our" , "out" , "outside" , "over" , "own" , "owner" , "page" , "pain" , "painting" , "paper" , "parent" , "part" , "participant" , "particular" , "particularly" , 
"partner" , "party" , "pass" , "past" , "patient" , "pattern" , "pay" , "peace" , "people" , "per" , "perform" , "performance" , "perhaps" , "period" , "person" , "personal" , "phone" , "physical" , "pick" , "picture" , "piece" , "place" , "plan" , "plant" , "play" , "player" , "PM" , "point" , 
"police" , "policy" , "political" , "politics" , "poor" , "popular" , "population" , "position" , "positive" , "possible" , "power" , "practice" , "prepare" , "present" , "president" , "pressure" , "pretty" , "prevent" , "price" , "private" , "probably" , "problem" , "process" , "produce" , "product" , "production" , 
"professional" , "professor" , "program" , "project" , "property" , "protect" , "prove" , "provide" , "public" , "pull" , "purpose" , "push" , "put" , "quality" , "question" , "quickly" , "quite" , "race" , "radio" , "raise" , "range" , "rate" , 
"rather" , "reach" , "read" , "ready" , "real" , "reality" , "realize" , "really" , "reason" , "receive" , "recent" , "recently" , "recognize" , "record" , "red" , "reduce" , "reflect" , "region" , "relate" , "relationship" , "religious" , "remain" , "remember" , "remove" , "report" , "represent" , "Republican" , 
"require" , "research" , "resource" , "respond" , "response" , "responsibility" , "rest" , "result" , "return" , "reveal" , "rich" , "right" , "rise" , "risk" , "road" , "rock" , "role" , "room" , "rule" , "run" , "safe" , "same" , "save" , "say" , "scene" , "school" , "science" , "scientist" , "score" , "sea" , 
"season" , "seat" , "second" , "section" , "security" , "see" , "seek" , "seem" , "sell" , "send" , "senior" , "sense" , "series" , "serious" , "serve" , "service" , "set" , "seven" , "several" , "sex" , "sexual" , "shake" , "share" , "she" , "shoot" , "short" , "shot" , "should" , "shoulder" , "show" , "side" , 
"sign" , "significant" , "similar" , "simple" , "simply" , "since" , "sing" , "single" , "sister" , "sit" , "site" , "situation" , "six" , "size" , "skill" , "skin" , "small" , "smile" , "so" , "social" , "society" , "soldier" , "some" , "somebody" , "someone" , "something" , "sometimes" , "son" , "song" , "soon" , 
"sort" , "sound" , "source" , "south" , "southern" , "space" , "speak" , "special" , "specific" , "speech" , "spend" , "sport" , "spring" , "staff" , "stage" , "stand" , "standard" , "star" , "start" , "state" , "statement" , "station" , "stay" , "step" , "still" , "stock" , "stop" , "store" , "story" , "strategy" , 
"street" , "strong" , "structure" , "student" , "study" , "stuff" , "style" , "subject" , "success" , "successful" , "such" , "suddenly" , "suffer" , "suggest" , "summer" , "support" , "sure" , "surface" , "system" , "table" , "take" , "talk" , "task" , "tax" , "teach" , "teacher" , "team" , "technology" , 
"television" , "tell" , "ten" , "tend" , "term" , "test" , "than" , "thank" , "that" , "the" , "their" , "them" , "themselves" , "then" , "theory" , "there" , "these" , "they" , "thing" , "think" , "third" , "this" , "those" , "though" , 
"thought" , "thousand" , "threat" , "three" , "through" , "throughout" , "throw" , "thus" , "time" , "to" , "today" , "together" , "tonight" , "too" , "top" , "total" , "tough" , "toward" , "town" , "trade" , "traditional" , "training" , "travel" , "treat" , "treatment" , "tree" , "trial" , "trip" , 
"trouble" , "true" , "truth" , "try" , "turn" , "TV" , "two" , "type" , "under" , "understand" , "unit" , "until" , "up" , "upon" , "us" , "use" , "usually" , "value" , "various" , "very" , "victim" , "view" , "violence" , "visit" , "voice" , "vote" , "wait" , "walk" , "wall" , "want" , "war" , 
"watch" , "water" , "way" , "we" , "weapon" , "wear" , "week" , "weight" , "well" , "west" , "western" , "what" , "whatever" , "when" , "where" , "whether" , "which" , "while" , "white" , "who" , "whole" , "whom" , "whose" , "why" , "wide" , "wife", 
"will" , "win" , "wind" , "window" , "wish" , "with" , "within" , "without" , "woman" , "wonder" , "word" , "work" , "worker" , "world" , "worry" , "would" , "write" , "writer" , "wrong" , "yard" , "yeah" , "year" , "yes" , "yet" , "you" , "young","your","yourself"
];
//The list of 1000 hard words that will be chosen from (Vocabulary.com for the words)
var word_bank_hard = [
"consider"," minute"," accord"," evident"," practice"," intend"," concern"," commit"," issue"," approach"," establish"," utter"," conduct"," engage"," obtain"," scarce"," policy"," straight"," stock"," apparent"," property"," fancy"," concept"," court"," appoint"," passage"," vain"," instance"," coast"," project",
" commission"," constant"," circumstances"," constitute"," level"," affect"," institute"," render"," appeal"," generate"," theory"," range"," campaign"," league"," labor"," confer"," grant"," dwell"," entertain"," contract"," earnest"," yield"," wander"," insist"," knight"," convince"," inspire"," convention",
" skill"," harry"," financial"," reflect"," novel"," furnish"," compel"," venture"," territory"," temper"," bent"," intimate"," undertake"," majority"," assert"," crew"," chamber"," humble"," scheme",
" keen"," liberal"," despair"," tide"," attitude"," justify"," flag"," merit"," manifest"," notion"," scale"," formal"," resource"," persist"," contempt"," tour"," plead"," weigh"," mode"," distinction"," inclined"," attribute"," exert"," oppress"," contend"," stake"," toil"," perish"," disposition"," rail",
" cardinal"," boast"," advocate"," bestow"," allege"," notwithstanding"," lofty"," multitude"," steep"," heed","modest"," partial"," apt"," esteem"," credible"," provoke"," tread"," ascertain"," fare"," cede"," perpetual"," decree"," contrive"," derived"," elaborate"," substantial"," frontier",
" facile"," cite"," warrant"," sob"," rider"," dense"," afflict"," flourish"," ordain"," pious"," vex"," gravity"," suspended"," conspicuous"," retort"," jet"," bolt"," assent"," purse"," plus"," sanction"," proceeding"," exalt"," siege",
" malice"," extravagant"," wax"," throng"," venerate"," assail"," sublime"," exploit"," exertion"," kindle"," endow"," imposed"," humiliate"," suffrage"," ensue"," brook"," gale"," muse"," satire"," intrigue"," indication"," dispatch"," cower"," wont"," tract"," canon"," impel"," latitude"," vacate",
" undertaking"," slay"," predecessor"," delicacy"," forsake"," beseech"," philosophical"," grove"," frustrate"," illustrious"," device"," pomp"," entreat"," impart"," propriety"," consecrate"," proceeds"," fathom"," objective"," clad"," partisan"," faction"," contrived"," venerable"," restrained",
" besiege"," manifestation"," rebuke"," insurgent"," rhetoric"," scrupulous"," ratify"," stump"," discreet"," imposing"," wistful"," mortify"," ripple"," premise"," subside"," adverse"," caprice"," muster"," comprehensive"," accede"," fervent"," cohere",
" tribunal"," austere"," recovering"," stratum"," conscientious"," arbitrary"," exasperate"," conjure"," ominous"," edifice"," elude"," pervade"," foster"," admonish"," repeal"," retiring"," incidental"," acquiesce"," slew"," usurp"," sentinel"," precision"," depose"," wanton"," odium"," precept",
" deference"," fray"," candid"," enduring"," impertinent"," bland"," insinuate"," nominal"," suppliant"," languid"," rave"," monetary"," headlong"," infallible"," coax"," explicate"," gaunt"," morbid"," ranging"," pacify"," pastoral"," dogged"," ebb"," aide"," appease"," stipulate"," recourse"," constrained",
" bate"," aversion"," conceit"," loath"," rampart"," extort"," tarry"," perpetrate"," decorum"," luxuriant"," cant"," enjoin"," avarice"," edict"," disconcert"," symmetry"," capitulate"," arbitrate"," cleave"," append"," visage"," horde",
" parable"," chastise"," foil"," veritable"," grapple"," gentry"," pall"," maxim"," projection"," prowess"," dingy"," semblance"," tout"," fortitude"," asunder"," rout"," staid"," beguile"," purport"," deprave"," bequeath"," enigma"," assiduous"," vassal"," quail"," outskirts"," bulwark"," swerve"," gird",
" betrothed"," prospective"," advert"," peremptory"," rudiment"," deduce"," halting"," ignominy"," ideology"," pallid"," chagrin"," obtrude"," audacious"," construe"," ford"," repast"," stint"," fresco"," dutiful"," hew"," parity"," affable"," interminable"," pillage"," foreboding"," rend"," livelihood",
" deign"," capricious"," stupendous"," chaff"," innate"," reverie"," wrangle"," crevice"," ostensible"," craven"," vestige"," plumb"," reticent"," propensity"," chide"," espouse"," raiment"," intrepid"," seemly"," allay"," fitful"," erode",
" unaffected"," canto"," docile"," patronize"," teem"," estrange"," spat"," warble"," mien"," sate"," constituency"," patrician"," parry"," practitioner"," ravel"," infest"," actuate"," surly"," convalesce"," demoralize"," devolve"," alacrity"," waive"," unwonted"," seethe"," scrutinize"," diffident",
" execrate"," implacable"," pique"," mite"," encumber"," uncouth"," petulant"," expiate"," cavalier"," banter"," bluster"," debase"," retainer"," subjugate"," extol"," fraught"," august"," fissure"," knoll"," callous"," inculcate"," nettle"," blanch"," inscrutable"," tenacious"," thrall"," exigency"," disconsolate",
" impetus"," imposition"," auspices"," sonorous"," exploitation"," bane"," dint"," ignominious"," amicable"," onset"," conservatory"," zenith"," voluble"," yeoman"," levity"," rapt"," sultry"," pinion"," axiom"," descry"," retinue",
" functionary"," imbibe"," diversified"," maraud"," grudging"," partiality"," philology"," wry"," caucus"," permeate"," propitious"," salient"," propitiate"," excise"," betoken"," palatable"," upbraid"," renegade"," hoary"," pedantic"," coy"," troth"," encroachment"," belie"," armada"," succor",
" imperturbable"," irresolute"," knack"," unseemly"," accentuate"," divulge"," brawn"," burnish"," palpitate"," promiscuous"," dissemble"," flotilla"," invective"," hermitage"," despoil"," sully"," malevolent"," irksome"," prattle"," subaltern"," welt"," wreak"," tenable"," inimitable"," depredation",
" amalgamate"," immutable"," proxy"," dote"," reactionary"," rationalism"," endue"," discriminating"," brooch"," pert"," disembark"," aria"," trappings"," abet"," clandestine"," distend"," glib"," pucker",
" rejoinder"," spangle"," blighted"," nicety"," aggrieve"," vestment"," urbane"," defray"," spectral"," munificent"," dictum"," fad"," scabbard"," adulterate"," beleaguer"," gripe"," remission"," exorbitant"," invocation"," cajole"," inclusive"," interdict"," abase"," obviate"," hurtle"," unanimity",
" mettle"," interpolate"," surreptitious"," dissimulate"," ruse"," specious"," revulsion"," hale"," palliate"," obtuse"," querulous"," vagary"," incipient"," obdurate"," grovel"," refractory"," dregs"," ascendancy"," supercilious"," pundit"," commiserate"," alcove"," assay"," parochial"," conjugal",
" abjure"," frieze"," ornate"," inflammatory"," machination"," mendicant"," meander"," bullion"," diffidence"," makeshift"," husbandry"," podium"," dearth"," granary"," whet"," imposture"," diadem"," fallow"," hubbub"," dispassionate"," harrowing",
" askance"," lancet"," rankle"," ramify"," gainsay"," polity"," credence"," indemnify"," ingratiate"," declivity"," importunate"," passe"," whittle"," repine"," flay"," larder"," threadbare"," grisly"," untoward"," idiosyncrasy"," quip"," blatant"," stanch"," incongruity"," perfidious"," platitude"," revelry",
" delve"," extenuate"," polemic"," enrapture"," virtuoso"," glower"," mundane"," fatuous"," incorrigible"," postulate"," gist"," vociferous"," purvey"," baleful"," gibe"," dyspeptic"," prude"," luminary"," amenable"," willful"," overbearing"," dais"," automate"," enervate"," wheedle"," gusto"," bouillon",
" omniscient"," apostate"," carrion"," emolument"," ungainly"," impiety"," decadence"," homily"," avocation"," circumvent"," syllogism"," collation"," haggle"," waylay"," savant"," cohort"," unction"," adjure"," acrimony"," clarion"," turbid"," cupidity"," disaffected"," preternatural"," eschew"," expatiate",
" didactic"," sinuous"," rancor"," puissant"," homespun"," embroil"," pathological"," resonant"," libretto"," flail"," bandy"," gratis"," upshot"," aphorism"," redoubtable"," corpulent"," benighted"," sententious"," cabal"," paraphernalia"," vitiate"," adulation"," quaff"," unassuming"," libertine"," maul",
" adage"," expostulation"," tawdry"," trite"," hireling"," ensconce"," egregious"," cogent"," incisive"," errant"," sedulous"," incandescent"," derelict"," entomology"," execrable"," sluice"," moot"," evanescent"," vat"," dapper"," asperity"," flair"," mote"," circumspect"," inimical"," apropos"," gruel",
" gentility"," disapprobation"," cameo"," gouge"," oratorio"," inclement"," scintilla"," confluence"," squalor"," stricture"," emblazon"," augury"," abut"," banal"," congeal"," pilfer"," malcontent"," sublimate"," eugenic"," lineament"," firebrand"," fiasco"," foolhardy"," retrench"," ulterior"," equable",
" inured"," invidious"," unmitigated"," concomitant"," cozen"," phlegmatic"," dormer"," pontifical"," disport"," apologist"," abeyance"," enclave"," improvident"," disquisition"," categorical"," placate"," redolent"," felicitous"," gusty"," natty"," pacifist"," buxom"," heyday"," herculean"," burgeon"," crone",
" prognosticate"," lout"," simper"," iniquitous"," rile"," sentient"," garish"," readjustment"," erstwhile"," aquiline"," bilious"," vilify"," nuance"," gawk"," refectory"," palatial"," mincing"," trenchant"," emboss"," proletarian"," careen"," debacle"," sycophant"," crabbed"," archetype"," cryptic",
" penchant"," bauble"," mountebank"," fawning"," hummock"," apotheosis"," discretionary"," pithy"," comport"," checkered"," ambrosia"," factious"," disgorge"," filch"," wraith"," demonstrable"," pertinacious"," emend"," laggard"," waffle"," loquacious"," venial"," peon"," effulgence"," lode"," fanfare",
" dilettante"," pusillanimous"," ingrained"," quagmire"," reprobation"," mannered"," squeamish"," proclivity"," miserly"," vapid"," mercurial"," perspicuous"," nonplus"," enamor"," hackneyed"," spate"," pedagogue"," acme"," masticate"," sinecure"," indite"," emetic",
" temporize"," unimpeachable"," genesis"," mordant"," smattering"," suavity"," stentorian"," junket"," appurtenance"," nostrum"," immure"," astringent"," unfaltering"," tutelage"," testator"," elysian"," fulminate"," fractious"," pummel"," manumit"," unexceptionable"," triumvirate"," sybarite"," jibe"," magisterial",
" roseate"," obloquy"," hoodwink"," striate"," arrogate"," rarefied"," chary"," credo"," superannuated"," impolitic"," aspersion"," abysmal"," poignancy"," stilted"," effete"," provender"," endemic"," jocund"," procedural"," rakish"," skittish"," peroration"," nonentity"," abstemious"," viscid"," doggerel",
" sleight"," rubric"," plenitude"," rebus"," wizened"," whorl"," fracas"," iconoclast"," saturnine"," madrigal"," discursive"," zealot"," moribund"," modicum"," connotation"," adventitious"," recondite"," zephyr"," countermand"," captious",
" cognate"," forebear"," cadaverous"," foist"," dotage"," nexus"," choleric"," garble"," bucolic"," denouement"," animus"," overweening"," tyro"," preen"," largesse"," retentive"," unconscionable"," badinage"," insensate"," sherbet"," beatific"," bemuse"," microcosm"," factitious"," gestate"," traduce",
" sextant"," coiffure"," malleable"," rococo"," fructify"," nihilist"," ellipsis"," accolade"," codicil"," roil"," grandiloquent"," inconsequential"," effervescence"," stultify"," tureen"," pellucid"," euphony"," apocryphal"," veracious"," pendulous"," exegesis"," effluvium"," apposite"," viscous",
" misanthrope"," vintner"," halcyon"," anthropomorphic"," turgid"," malaise"," polemical"," gadfly"," atavism"," contusion"," parsimonious"," dulcet"," reprise"," anodyne"," bemuse"
];

//start function, that initiates the keys that should be hit
function start()
{
    //tells the player how to start the program
    alert("Hit s to start once you hit enter to get rid of this box");
    //Initiates the function that deals with pressing keys on the keyboard
    keyDownMethod(keyDown);
}

//Function that deals with s for starting and n for the next guess
function keyDown(e)
{
    //if the user presses s on the keyboard the program starts
    if(e.keyCode == Keyboard.letter('S'))
    {
        //word difficulty is chosen
        wordDifficulty();
        //A random word from the easy or hard word banks, 
        //depending on the boolean status of the word_difficulty_easy variable
        random_word();
        //The game word, with question marks is created with the specific length
        game_word_create(word.length);
        //The word array is printed in the console for testing purposes, can be removed without repercussions
        println(word);
        //Determines the amount of guesses the user gets
        amount_of_guesses();
        //Creates the lines on the canvas
        all_lines();
        //Creates the guesses left visual on the canvas
        guesses_left_visual_set();
        //Tells the user how to initiate each new guess
        alert("Press N to guess each time");
    }
    //if n is pressed on the keyboard
    if(e.keyCode == Keyboard.letter('N'))
    {
        //for next guess   
        guess();
    }
}

//Function that determines the difficulty of the word, to determine which word bank is used
function wordDifficulty()
{
    //Sets up a loop and a half so that if the wrong value is typed the question is asked again.  Vital to the program
    while(true)
    {
        //Variable that asks the user for the difficulty level he/she would like to play at
        var diff = prompt("Now we are choosing difficulty... 1 is easy and 6 is Extreme. \nDifficulty 1: Easy word, large amount of guesses.\nDifficulty 2: Easy word, medium amount of guesses. \nDifficulty 3: Easy word, small amount of guesses. \
        \nDifficulty 4: Difficult word, large amount of guesses. \nDifficulty 5: Difficult word, medium amount of guesses. \nDifficulty 6: Difficult word, small amount of guesses");                                    
        if(diff >= 1 && diff <= 6)
        {
            //If difficulty level 1 is chosen...
            if(diff == 1)
            {
                //Easy word difficulty is set
                word_difficulty_easy = true; 
            }
            //If difficulty level 2 is chosen...
            else if(diff == 2)
            {
                //Easy word difficulty is set 
                word_difficulty_easy = true; 
            }
            //If difficulty level 3 is chosen...
            else if(diff == 3)
            {
                //Easy word difficulty is set
                word_difficulty_easy = true; 
            }
            //If difficulty level 4 is chosen...
            else if(diff == 4)
            {
                //Hard word difficulty is set
                word_difficulty_easy = false; 
            }
            //If difficulty level 5 is chosen...
            else if (diff == 5)
            {
                //Hard word difficulty is set
                word_difficulty_easy = false; 
            }
            //If difficulty level 6 is chosen...
            else if (diff == 6)
            {
                //Hard word diffiuclty is set
                word_difficulty_easy = false;  
            }
            //Once the word difficulty is chosen the local difficulty variable is made global, 
            //soecifically to be used in the amount of guesses function.
            window.diff = diff;
            //breaks from the while loop once done
            break;
        }
    }
}

//Function that is used to determine the amount of guesses the user will recieve
function amount_of_guesses()
{
    //Uses the difficulty variable value from the word Difficulty function that was made global
    if(diff == 1)
    {
        //With word difficult 1, the user gets an amount of guesses that is 4 times the word length
        guesses_left = (word.length * 4);
    }
    else if(diff == 2)
    {
        //With word difficult 2, the user gets an amount of guesses that is 3 times the word length
        guesses_left = (word.length * 3);
    }
    else if(diff == 3)
    {
        //With word difficult 3, the user gets an amount of guesses that is 1.85 times the word length floored
        guesses_left = Math.floor(word.length * 1.85);
    }
    else if(diff == 4)
    {
        //With word difficult 4, the user gets an amount of guesses that is 5 times the word length
        guesses_left = (word.length * 5); 
    }
    else if (diff == 5)
    {
        //With word difficult 5, the user gets an amount of guesses that is 3 times the word length
        guesses_left = (word.length * 3);
    }
    else if (diff == 6)
    {
        //With word difficult 6, the user gets an amount of guesses that is 2.5 times the word length floored
        guesses_left = Math.floor(word.length * 2.5);
    }    
}

//Function that determines the word that is going to be used  
function random_word()    
{
    //If the word difficulty was determined to be easy the following code runs
    if(word_difficulty_easy == true)
    {
        //A random number if chosen and the word at that location in the easy word bank is temporarly stored
        //in a different array that will be cleaned in the sense that all excess spaces will be removed
        var num = Randomizer.nextInt(0,word_bank_easy.length);
        var word_dirty = (word_bank_easy[num]).split("");
    }
    else if (word_difficulty_easy == false)
    {
        //A random number if chosen and the word at that location in the hard word bank is temporarly stored
        //in a different array that will be cleaned in the sense that all excess spaces will be removed
        var num = Randomizer.nextInt(0,word_bank_hard.length);
        var word_dirty = (word_bank_hard[num]).split("");    
    }
    //For loop that adds all letters in the dirty word array to the global word array, and does not add any 
    //spaces to get rid of all spaces
    for(var i = 0; i < word_dirty.length; i++)
    {
        //if the value at a certain location is not a space the value is pushed to the word array
        if(word_dirty[i] != " ")
        {
            word.push(word_dirty[i]);    
        }
    }
}

//function that sets the question mark array with the correct amount of question marks   
function game_word_create(length)
{
    for(var i = 0; i < length; i++)
    {
        gameword[i] = ("?");
    }
}

//Function that runs the user guesses
function guess()
{
    //If the question mark array contains no question marks and there are still some guesses left, then the user won
    if(all_blank(gameword,"?") == true && guesses_left != 0)
    {
        //Then the user won
        win = true;
        //Large green leters on the screen saying he/she won are displayed on the canvas
        create_letter(25,(getHeight()/2)+100,"YOU WON",Color.green,"55pt Arial");
        //the amount of guesses left is set to zero so no more guesses can be made, since the game was won
        guesses_left = 0;
    }
    //If the word has not been guessed yet and there are still guesses left the following code runs
    if(guesses_left != 0)
    {
        //The user is alerted abount how many guesses are left, in addition to the counter on the canvas
        alert("You have " + guesses_left + " guesses left" + "\n" + "You have guessed these letters: " + guessed + "\n" + "Word so far: " + gameword);
        // The current status of the word being guessed is printed
        println(gameword.join(""));
        //variable that prompts the user for the letter he/she wants to guess, broken into an array
        var letter_guess_raw = prompt("Make a letter guess, if you don't put in a number, you will not be given another guess and if you put multiple letters, the first will be taken.").split("");    //               
        //Takes the first value in thr original guess, to ensure that the guess was only one letter
        var letter_guess = letter_guess_raw[0];
        //Decreases the amount of guesses by one
        guesses_left--;
        //if the letter guess was correct...
        if (contains(word,letter_guess))
        {
            //the locations at which the letters are located are determined
            var locations = location(word,letter_guess);
            for(var i = 0; i < locations.length; i++)
            {
                //The question marks are replaced with the letter that was guessed
                gameWord(letter_guess);
            }
            //The user is told that he/she guessed a letter
            alert("You guessed a letter!  Press N for next guess.");
        }
        //If the guess was not a correct guess
        else
        {
            //And there are guesses left
            if (guesses_left != 0)
            {
                //the user told he/she guessed the wrong letter
                alert("Incorrect Guess, Press N for the next guess.");
            }
            else
            {
                //If there are no letters left then the user is told the game is over
                alert("Game Over, hit enter to retart the game");
            }
        }
        //The letter guessed is pushed into the guessed letters array
        guessed.push(letter_guess);
    }
    else
    {
        if(win == false)
        {
            alert("Game Over, hit enter to retart the game" + "\n" + "The word was " + word.join("") + ".");
            create_letter(25,(getHeight()/2)+100,"GAME OVER",Color.red,"35pt Arial");
        }
        else if(win == true)
        {
            alert("YOU WON");
            create_letter(25,(getHeight()/2)+100,"YOU WON",Color.green,"55pt Arial");
        }
    }
    print_gameword();
    guesses_left_visual.setText(guesses_left);
}

function gameWord(guess)
{
    for(var i = 0; i < word.length; i++)
    {
        //If the letter at a certain position in the word array is the same as player's guess...
        if (word[i] == guess) 
        {
            //then the '?" at that location is changed to the guess
            gameword[i] = guess;  
        }
    }
}

//The array that determines if the gameword array has any '?' left in it
function all_blank(array,character)
{
    //The complete variable is set false to start
    var complete = false;
    //sets the all good variable to 0
    var all_good = 0;
    //runs the loop the amount of times equal to the length of the array called
    for(var i = 0; i < array.length; i++)
    {
        //If the current position in the array does not have the character called, in this case the question mark then 1 is added to the all_good variable
        if(array[i] != character)
        {
            all_good++;    
        }
    }
    //If the amount good is equal to the length of the array then that means no position in the array contains the character, the question mark in this case.
    if(all_good == array.length)
    {
        //the complete varialbe is set true if the array does not contain the character 
        complete = true;    
    }
    //the boolean status of the complete variable is returned
    return complete;
}

function location(array, val) 
{
    var position = [];
    //runs the loop the amount of times equal to the length of the array called
    for (var i = 0; i < array.length; i++)
    {
        //checks each position of the word array and if the letter is the same as the guess...
        if(word[i] == val)
        {
            //...then the numerical position is pushed into another array.
            position.push(i);
        }
    }    
    return position;
}
//Function that determines is a value is located in the array called
function contains(array, val)
{
    //Sets the has variable to false to start
    var has = false;
    //A loop that runs the code an amount of time equal to the length of the array called
    for(var i = 0; i < array.length; i++)
    {
        //if the value of the array at any psotion is equal to the value....
        if(array[i] == val)
        {
            //Then the has variable is set true which means the array does contain the value
            has = true;
        }
    }
    //The boolean status of the has variable is returned
    return has;
}

function all_lines()
{
    // Location Divides the canvas into a certain amount of blocks  that 
    //is double the amount of letters in the word, so there can be a space inbetween the letters
    var location = getWidth()/(word.length * 2); 
    // The purpose of (location/2) is to center the lines by adding half of a block to each 
    //of the starts and ends
    var center = (location/2);
    //For loop that creates a line for each letter in the word
    for(var i = 0; < word.length; i++)         
    {                                                        
        //for the first line
        if(i == 0)                         
        {                                 
            //the line is created at this location
            create_line(location/2,location + center); 
        }
        if(i > 0)
        {
            //The rest of the lines are created separate and spaced prefectly in accordance to the amount
            //of letters there are in the word
            create_line(((2*i)*location) + center ,(((2*(i))*location) + location) + center);  
        }
    }
}

//function for creating a line, with the locations being varied
function create_line(x1,x2)
{
    //Line parameters
    var line = new Line(x1, 100, x2, 100);
    line.setColor(Color.purple);
    line.setLineWidth(10);
    add(line);
}

function print_gameword()
{
    // Location Divides the canvas into a certain amount of blocks  that is double the amount of letters in the word, so there can be a space inbetween the letters
    var location = getWidth()/(gameword.length * 2); 
    // The purpose of (location/2) is to center the lines by adding half of a block to each of the starts and ends
    var center = (location/2);
    
    for(var i = 0; i < gameword.length; i++)         
    {                                                        
        //if the letter is guessed correctly and therfore no longer a "?"
        if(gameword[i] != "?")
        {
            if(i == 0)                         
            {                                 
                //Creates the letter at the first letter location
                create_letter(location/2, 95, gameword[i],Color.gray,guess_size()); 
            }
            
            if(i > 0)
            {
                //Creates the letter at the other locations
                create_letter(((2*i)*location) + center, 95, gameword[i], Color.gray,guess_size());  
            }
        }
    }    
}

//Function that will take perameters for the letter and then print it on the canvas
//the location, color and font size needs to be indentified with the calling
function create_letter(x,y,letter,color_choice,font)
{
    var txt = new Text(letter,font);
    txt.setColor(color_choice);
    txt.setPosition(x,y);
    add(txt);
}

//Function that creates the visual on the canvas that displays the amount of guesses left
//it is its own function so the value can change as the amount of guesses change
function guesses_left_visual_set()
{
    guesses_left_visual = new Text(guesses_left,"30pt Arial");
    guesses_left_visual.setPosition(25,getHeight()/2);
    guesses_left_visual.setColor(Color.orange)
    add(guesses_left_visual);
    
    create_letter(75,getHeight()/2,"guesses left.",Color.purple,"25pt Arial");
}

//Function that takes the amount of letters that have to go on the screen and selects a sensible font size 
//that is comparable to the line size
function guess_size()
{
    if(word.length < 5)
    {
        return "50pt Arial";
    }
    else if(word.length < 12 && word.length >5)
    {
        return "40pt Arial";
    }
    else if(word.length >= 17)
    {
        return "25pt Arial";
    }
    else
    {
        return "30pt Arial";
    }
}







        if (typeof start === 'function') {
            start();
        }

        // Overrides setSize() if called from the user's code. Needed because
        // we have to change the canvas size and attributes to reflect the
        // user's desired program size. Calling setSize() from user code only
        // has an effect if Fit to Full Screen is Off. If Fit to Full Screen is
        // On, then setSize() does nothing.
        function setSize(width, height) {
            if (!true) {
                // Call original graphics setSize()
                window.__graphics__.setSize(width, height);

                // Scale to screen width but keep aspect ratio of program
                // Subtract 2 to allow for border
                var canvasWidth = window.innerWidth - 2;
                var canvasHeight = canvasWidth * getHeight() / getWidth();

                // Make canvas reflect desired size set
                adjustMarginTop(canvasHeight);
                setCanvasContainerSize(canvasWidth, canvasHeight);
                setCanvasAttributes(canvasWidth, canvasHeight);
            }
        }
    };

    var stopProgram = function() {
        removeAll();
        window.__graphics__.fullReset();
    }

    window.onload = function() {
        if (!false) {
            $('#btn-container').remove();
        }

        var canvasWidth;
        var canvasHeight;
        if (true) {
            // Get device window width and set program size to those dimensions
            setSize(window.innerWidth, window.innerHeight);
            canvasWidth = getWidth();
            canvasHeight = getHeight();

            if (false) {
                // Make room for buttons if being shown
                $('#btn-container').css('padding', '5px 0');
                canvasHeight -= $('#btn-container').outerHeight();
            }

            setCanvasAttributes(canvasWidth, canvasHeight);
        } else {
            // Scale to screen width but keep aspect ratio of program
            // Subtract 2 to allow for border
            canvasWidth = window.innerWidth - 2;
            canvasHeight = canvasWidth * getHeight() / getWidth();

            // Light border around canvas if not full screen
            $('#canvas-container').css('border', '1px solid #beccd4');

            adjustMarginTop(canvasHeight);
        }

        setCanvasContainerSize(canvasWidth, canvasHeight);

        if (true) {
            runProgram();
        }
    };

    // Set the canvas container width and height.
    function setCanvasContainerSize(width, height) {
        $('#canvas-container').width(width);
        $('#canvas-container').height(height);
    }

    // Set the width and height attributes of the canvas. Allows
    // getTouchCoordinates to sense x and y correctly.
    function setCanvasAttributes(canvasWidth, canvasHeight) {
        $('#game').attr('width', canvasWidth);
        $('#game').attr('height', canvasHeight);
    }

    // Assumes the Fit to Full Screen setting is Off. Adjusts the top margin
    // depending on the Show Play/Stop Buttons setting.
    function adjustMarginTop(canvasHeight) {
        var marginTop = (window.innerHeight - canvasHeight)/2;
        if (false) {
            marginTop -= $('#btn-container').height()/3;
        }
        $('#canvas-container').css('margin-top', marginTop);
    }
</script>
</body>
</html>
`;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden />
                <WebView
                    source={{html: webViewCode, baseUrl: "/"}}
                    javaScriptEnabled={true}
                    style={{ flex: 1 }}
                    scrollEnabled={false}
                    bounces={false}
                    scalesPageToFit={false}
                ></WebView>
            </View>
        );
    }
}
