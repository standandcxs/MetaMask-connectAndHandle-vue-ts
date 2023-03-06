<template>
  <van-button type="primary" @click="createAccount"
    >创建以太坊账户并获取余额</van-button
  >
  <div>账户地址:{{ accountInfo.address }}</div>
  <div>账户私钥:{{ accountInfo.privateKey }}</div>
  <div>账户余额:{{ accountInfo.balance }}</div>
  <hr />
  <h3>手动输入地址获取账户的信息</h3>
  <div>账户地址:{{ myAccount.address }}</div>
  <div>账户私钥:{{ myAccount.privateKey }}</div>
  <div>账户余额:{{ myAccount.balance }}</div>
  <van-button type="primary" @click="send">开始转帐</van-button>
  <hr />
  <h2>助记词：</h2>
  <p>{{ creteMyAccount.mnemonic }}</p>
  <h2>路径</h2>
  <p>m/44'/60'/0'/0/0</p>
  <h2>地址</h2>
  <p>{{ creteMyAccount.address }}</p>
  <h2>私钥</h2>
  <p>{{ creteMyAccount.privateKey }}</p>
  <!-- 检测是否有metamask -->
  <van-button type="primary" @click="testMetamask"
    >检测是否存在metamask</van-button
  >
  <van-button type="primary" @click="connectWallet">连接钱包</van-button>
  <van-button type="primary" @click="getConnectedWalletAddress"
    >获取所有连接账户地址</van-button
  >
  <van-button type="primary" @click="test"
    >选择连接账户成功后返回所有账户地址</van-button
  >
  <van-button type="primary" @click="addToken">为metamask添加代币</van-button>
  <van-button type="primary" @click="cutChain">切换指定链</van-button>

  <!-- <div id="demo">
    // close init connect
    <VueMetamask ref="metamask" :initConnect="false"></VueMetamask>

    // click button call Init
    <button @click="connect">connect</button>
  </div> -->
  <ConnectWalletButton address="0x971179C4631bbc4731624fd098C12f105Ea51cb6" />
</template>
<script setup lang="ts">
import { reactive, toRefs, ref } from "vue";
import { ConnectWalletButton } from "vue-connect-wallet";
import { useMetaMaskWallet } from "vue-connect-wallet";
import Web3 from "web3";
import Tx from "ethereumjs-tx";
import * as bip39 from "bip39";
import * as wt from "ethereumjs-wallet";
import VueMetamask from "vue-metamask";

import { Buffer } from "buffer";

// 对metamask的操作
const wallet = useMetaMaskWallet();
// 如果钱包已连接，返回账户地址阵列，否则打开MetaMask弹出窗口。
//  *出错时，返回一个带有错误信息的单一字符串
const connectWallet = async () => {
  console.log(await wallet.connect());
};
const getConnectedWalletAddress = async () => {
  //   * 获取所有连接的账户地址。如果没有连接，则返回一个空数组。
  //  * 如果出错，返回一个带有错误信息的单一字符串。
  const accountAddressArr = await wallet.getAccounts();
  console.log(accountAddressArr);
};
// * 打开一个MetaMask弹出窗口，从用户的账户列表中连接/断开连接。返回一个数组。
//  * 即使用户已经连接了一些账户，该弹出窗口也会打开。
//  * 如果出错，返回一个带有错误信息的单一字符串。
const test = async () => {
  console.log(await wallet.switchAccounts());
};
// * 在MetaMask中添加一个令牌
//  * @param symbol 令牌的符号，最多五个字符
//  * @param address 令牌的地址
//  * @param imageURL 令牌图像的字符串URL
//  * @param decimals (Optional) 默认为18。
//  * @param type (可选) 默认为ERC20
const addToken = async () => {
  // console.log(await wallet.addTokenToWallet());
};
// * 切换到一个链，或者如果用户没有这个链，则添加这个链
//  * @param chainId ChainID为整数
//  * @param chainConfig （可选） 用于添加新链的链配置界面
const cutChain = () => {
  wallet.switchOrAddChain(5);
};
// 检测浏览器是否安装了metamask
const testMetamask = () => {
  const isExist = wallet.isMetaMask;
  if (isExist) {
    alert("浏览器能检测到metamask");
  } else {
    alert("浏览器不能能检测到metamask");
  }
};
// * 当用户改变MetaMask中的账户时，事件处理程序。
//  *
//  * 事件处理程序的参考：https://docs.metamask.io/guide/ethereum-provider.html#events
//  *param callback 以账户字符串阵列为参数的函数
wallet.onAccountsChanged(address => {
  console.log(address);
  
})
// * 当用户改变MetaMask中的活动链时，事件处理程序。
//  *
//  * 事件处理程序的参考：https://docs.metamask.io/guide/ethereum-provider.html#events
//  *param callback 以链号为参数的函数。
//  */
wallet.onChainChanged((chainId) => {
  console.log(chainId);
});


var web3 = new Web3(
  Web3.givenProvider ||
    "wss://goerli.infura.io/ws/v3/a132e98ebba440129ba1bdd405b9eae1"
);
const state = reactive<{
  name: string;
  msg: string;
  accountInfo: {
    address: string;
    privateKey: string;
    balance: string;
  };
  myAccount: {
    address: string;
    privateKey: string;
    balance: string;
  };
  creteMyAccount: {
    mnemonic: string;
    address: string;
    privateKey: string;
  };
}>({
  msg: "This is demo net work",
  name: "web3",
  accountInfo: {
    address: "",
    privateKey: "",
    balance: "",
  },
  myAccount: {
    address: "0x971179C4631bbc4731624fd098C12f105Ea51cb6",
    privateKey:
      "e8feefdb2e4290bc5186298b0836a92861b1a7253999ebed2ae490a40d5823a3",
    balance: "",
  },
  creteMyAccount: {
    mnemonic:
      "common tide hard absurd find keen culture junk engage imitate category elder",
    address: "",
    privateKey: "",
  },
});
const metamask: any = ref(null);
const connect = () => {
  console.log(metamask.value.init());
};
let { name, accountInfo, myAccount, creteMyAccount } = toRefs(state);
const account = web3.eth.accounts.create("aaaaaaaaaa");
const createAccount = () => {
  accountInfo.value.address = account.address;
  accountInfo.value.privateKey = account.privateKey;
  web3.eth.getBalance(account.address).then((res) => {
    accountInfo.value.balance = res;
  });
};
web3.eth.getBalance(myAccount.value.address).then((res) => {
  myAccount.value.balance = res;
});
// 转账
const send = async () => {
  // 1构建转账参数
  // 获取账户交易次数
  const nonce = await web3.eth.getTransactionCount(myAccount.value.address);
  // 获取预计转账的gas费
  const gasPrice = await web3.eth.getGasPrice();
  // 转账金额以wei作为单位
  const value = web3.utils.toWei("0.01");
  const rawTx = {
    from: myAccount.value.address,
    to: "0xE58dcfBEFbC609a9BB76F0D5fba15fcEcC98423e",
    nonce,
    gasPrice,
    value,
    data: "0x00",
    gas: 0,
  };
  // 2.生成serializedTx
  // 转化私钥
  const privateKey = Buffer.from(myAccount.value.privateKey, "hex");
  // gas估算
  const gas = await web3.eth.estimateGas(rawTx);
  rawTx.gas = gas;
  // ethereumjs-tx实现私钥加密
  const tx = new Tx(rawTx);
  tx.sign(privateKey);
  // 生成serializeTx
  const serializedTx = `0x${tx.serialize().toString("hex")}`;
  // 开始转账
  const trans = web3.eth.sendSignedTransaction(serializedTx);
  // 监听转账
  // 开始转帐就开始监听并返回交易id
  trans.on("transactionHash", (txid) => {
    // console.log("交易ID:", txid);
    // console.log(`https://goerli.etherscan.io/tx/${txid}`);
  });
  // 有节点确认才会触发
  trans.on("receipt", (res) => {
    // console.log(res);
  });
  // 有除第一个节点以外的其他节点确认就会一直打印
  trans.on("confirmation", (res) => {
    // console.log("111", res);
  });
};
// 生成助记词
const createAccountOfmnemonic = () => {
  const mnemonic = bip39.generateMnemonic();
};
// 生成密钥对 keypair
bip39.mnemonicToSeed(creteMyAccount.value.mnemonic).then((seed) => {
  const hdWallet = wt.hdkey.fromMasterSeed(seed);
  // 路径的不同生成的密钥对也不同,相当于小狐狸一个钱包对应的多个账户
  const keypair = hdWallet.derivePath("m/44'/60'/0'/0/0");
  // 获取私钥
  // 获取钱包对象
  const wallet = keypair.getWallet();
  // 获取钱包地址
  const lowerCaseAddress = wallet.getAddressString();
  // 获取钱包的校验地址
  const checkAddress = wallet.getChecksumAddressString();
  // 获取私钥
  const privateKey = wallet.getPrivateKey().toString("hex");
  creteMyAccount.value.address = lowerCaseAddress;
  creteMyAccount.value.privateKey = privateKey;
  // 通过私钥获取地址
  const pk = Buffer.from(privateKey, "hex");
  const wallet3 = wt.default.fromPrivateKey(pk);
  const address2 = wallet3.getAddressString();
  // console.log(address2);

  // 导出keystore两种方法
  // 1.web3js导出
  const keystore = web3.eth.accounts.encrypt(privateKey, "111111");
  // 2.wallet对象导出
  wallet.toV3("111111").then((keystore2) => {
    // 通过keystore获取私钥两种方法
    // 1.web3
    const res = web3.eth.accounts.decrypt(keystore, "111111");
    const key1 = res.privateKey;
    // console.log(key1);

    // 2.wallet
    wt.default.fromV3(keystore2, "111111").then((res2) => {
      const key2 = res2.getPrivateKey().toString("hex");
      // console.log(key2);
    });
  });
});
</script>

<style scoped></style>
