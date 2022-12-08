<template>
  <div id="app">
    <router-view />
  </div>
</template>


<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

//重写tabs样式
.ivu-tabs {
  .ivu-tabs-bar {
    margin-bottom: 0;
  }
}

//重写card padding
.ivu-card-body {
  padding: 8px;
}

//除去滚动条默认样式
// ::-webkit-scrollbar {
//   width: 0px;
//   height: 0px;
// }

//滚动条整体样式
// .el-scrollbar__wrap {
//   overflow-y: scroll;
//   overflow-x: hidden;
//   -ms-overflow-style: none;

//   &::-webkit-scrollbar {
//     width: 0px;
//     height: 0px;
//   }
// }
</style>