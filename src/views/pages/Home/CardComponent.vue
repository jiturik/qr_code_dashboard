<template>
  <div>
    <div class="panel">
      <div class="card card--front">
        <div class="row">
          <div class="col-md-5 qr_code">
            <img src="@/assets/images/logo/qr-code.png" style="height: 110px" />
          </div>
          <div class="col-md-6 crddetails">
            <h6 style="color: #fff; letter-spacing: 4px">AJIT MAURYA</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr_code {
  background: #fff;
  padding: 10px;
}
.crddetails {
  border-left: 1px solid #fff;
  padding: 10px;
  color: #fff;
  margin-left: 20px;
  /* background: #bc9393; */
}
.scan {
  font-size: 12px;
  padding-top: 2px;
  width: 45%;
  text-align: center;
}
.card {
  font: 16px/1.5 "Helvetica Neue", Helvetica, sans-serif;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 350px;
  height: 200px;
  text-align: left;
  padding: 30px;
  margin-bottom: 50px;
  color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  background: url("../../../assets/images/pages/backgroundImage.jpg") no-repeat
    0 0 #141819;
}
.card__number {
  font-size: 26px;
  padding: 27px 0 20px;
  text-align: center;
}
.card__expiry-date {
  font-size: 14px;
  padding-bottom: 20px;
  text-align: center;
}
.card__owner {
  text-align: left;
}
.card__logo {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
.card__strip {
  background: #000;
  height: 50px;
  margin-bottom: 30px;
}
.card__signature {
  float: left;
  width: 65%;
  height: 40px;
  margin-left: 10px;
  background: #999;
}

.card--front {
  font-size: 16px;
  font-family: "OCRA";
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
}

.panel {
  width: 600px;
  margin: 0 auto;
  margin-bottom: 50px;
  text-align: center;
}
</style>
