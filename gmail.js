function mailSearch() {
  var searchText = "label:bt-応募がありました -{テスト} -{てすと} after:";
  var date = new Date();
  var today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();    // 2016/2/14 
  searchText += today;  // Gmail上の検索文言指定
  
  var threads = GmailApp.search(searchText);
  var pepperNum = 20; // 何CVごとにPepperBotを飛ばすか
  sheet.clear();
  var msgNum = 0;
  
  for(var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    
    // スレッド内のメッセージごとに処理
    for(var j = 0; j < messages.length; j++) {
      msgNum++;
      
      // TODO そのうちアプリのCV時にも送るようにする。
    }
  }
  
  if (msgNum % pepperNum == 0 && msgNum > 1) {
    sendTotalCvNum(msgNum);
  }
}

function sendTotalCvNum(msgNum) {
  var pepperMsg = "現在" + msgNum + "CVです。\n";
  
  switch(Math.floor(msgNum/20)) {
    case 1:
      pepperMsg += "まだまだこれからー( ✧Д✧)";
      break;
    case 2:
      pepperMsg += "昼前なら順調！( ◉ ∀ ◉ )";
      break;
    case 3:
      pepperMsg += "おやつ食べた？( ⓛ ω ⓛ *)";
      break;
    case 4:
      pepperMsg += "おなか空いたー(*´ω｀*)";
      break;
    case 5:
      pepperMsg += "1 0 0 CV \n( ・ˇ∀ˇ・)ｱﾊハ八ﾉヽﾉヽﾉ ＼ / ＼";
      break;
    case 6:
      pepperMsg += "そろそろ眠くない？ (・ー・) ";
      break;
    case 7:
      pepperMsg += "絶好調！！！ \n(　´,_ゝ｀)ｸｯｸｯｸ･･･(　´∀｀)ﾌﾊﾊﾊﾊ･･･(　 ﾟ∀ﾟ)ﾊｧｰﾊｯﾊｯﾊｯﾊ!!";
      break;
    default:
      pepperMsg += "燃えろぉぉぉおおぉぉぉおぉぉおぉぉぉお─=≡Σ((( つ•̀ω•́)つ";
  }
  
  sendPepperBot("bt_all", pepperMsg);
}

function sendPepperBot(channel, text) {
  // 引数がなかった場合
  if (!channel) {
    channel = "kuwako_test";
  };
  if (!text) {
    text = "Hi, I am Pepper. How are you?"; 
  }
  
  var slack_url = "https://hooks.slack.com/services/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";
  
  res = UrlFetchApp.fetch(slack_url, {
    payload : JSON.stringify({
      channel : channel,
      text : text,
    })
  });
  
  Logger.log(res);
}