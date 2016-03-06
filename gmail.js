function mailSearch() {
  var searchText = "label:bt-応募がありました -{テスト} -{てすと} after:";
  var date = new Date();
  var today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();    // ex) 2016/2/14 
  searchText += today;  // Gmail上の検索文言指定
  
  var threads = GmailApp.search(searchText);
  var pepperNum = 20; // 何CVごとにPepperBotを飛ばすか
  var msgNum = 0;
  
  if (!threads[0]) {
    return false;
  }
  
  // 最新の受信日時のオブジェクト
  var lastMessageDate = threads[0].getLastMessageDate();
  
  // 最新のメール受信日時と現在日時が違った場合は処理終了して弾く。
  if (lastMessageDate.getDate() !== date.getDate()
    || lastMessageDate.getHours() !== date.getHours()
    || lastMessageDate.getMinutes() !== date.getMinutes()) {
      Logger.log("最新メール受信日時と異なっています");
      return false;
  }
  
  for (var i = 0; i < threads.length; i++) {
    msgNum += threads[i].getMessageCount();
  }
  
  if (msgNum < 1) {
    return false;
  }
  
  // bt_allに投げるやつ
  if (msgNum % pepperNum == 0) {
    sendTotalCvNum(msgNum);
  }
  
  // TODO 
  // 本当は上のロジックは正しくない。これだと、1分以内に件数が79 -> 81になった場合などに対応できていない。
  // しかし、網羅的にやろうとするとforでたくさんGoogleAPIを叩かないといけないので、一旦保留
  
  // kuwako_testに投げる
  if (msgNum % 5 == 0) {
    sendPepperBot("kuwako_test", msgNum + "CV!!!");
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
      pepperMsg += "(≧∇≦)b　１ ０ ０ Ｃ Ｖ ！！　(≧∇≦)b";
      break;
    case 6:
      pepperMsg += "そろそろ眠い時間？ (・ー・) ";
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

function tanakasanBot() {
  var date = new Date();
  
  // 23:59以外なら非実行
  if (date.getHours() != 23 || date.getMinutes() != 59) {
    return false;
  }
  
  var searchText = "label:bt-応募がありました -{テスト} -{てすと} after:";
  var today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();    // 2016/2/14 
  searchText += today;  // Gmail上の検索文言指定
  
  var threads = GmailApp.search(searchText);
  var msgNum = 0;
  
  for (var i = 0; i < threads.length; i++) {
    msgNum += threads[i].getMessageCount();
  }
  
  var msg = "今日のCV数は..." + msgNum + "CVでした!!!";
  
  if (msgNum < 140) {
    msg += "\n@mitsuru.tanaka \n田中さぁぁあぁぁぁぁん \nｱｰﾒﾝ( -ω-)m †┏┛教会┗┓†";
  }
  
  sendPepperBot("bt_all", msg);
}

function googleAnalyticsAlert() {
  var accounts = Analytics.Management.Accounts.list(); 
 
  if (accounts.getItems()) {
    //GoogleAnalyticsで複数のブログの計測をしている方は[1]の数字を変更する
    var firstAccountId = accounts.getItems()[0].getId();

    var webProperties = Analytics.Management.Webproperties.list(firstAccountId);
    if (webProperties.getItems()) {

      var firstWebPropertyId = webProperties.getItems()[0].getId();
      var profiles = Analytics.Management.Profiles.list(firstAccountId, firstWebPropertyId);

      if (profiles.getItems()) {
        var firstProfile = profiles.getItems()[0];
        Logger.log(firstProfile);
        return firstProfile;

      } else {
        throw new Error('No views (profiles) found.');
      }
    } else {
      throw new Error('No webproperties found.');
    }
  } else {
    throw new Error('No accounts found.');
  }
}