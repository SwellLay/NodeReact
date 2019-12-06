Number.prototype.toFixedFloat = function (digits) {
  let re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
};
console.log(5.467.toFixedFloat(2));