let id = 1005; 
let secretkey = "o89OpssgOP94R9so89TTs0Zgtto89Nao";  
let submitapi = "http://pay.700b.cn/createpay.php";  
let queryapi = "http://pay.700b.cn/query.php";     
let return_url = "/pages/order_paid/order_paid";   
import md5 from 'md5';function a(a){var b="",c=[];for(var d in a)if("sign"==d||"sign_type"==d||"return_url"==d)continue;else c.push(d);for(var e=0;e<c.length;e++)for(var f=0;f<c.length-1;f++)if(c[f].charCodeAt(0)>=c[f+1].charCodeAt(0))if(c[f].charCodeAt(0)!=c[f+1].charCodeAt(0)){var g=c[f];c[f]=c[f+1],c[f+1]=g}else if(c[f].charCodeAt(1)>c[f+1].charCodeAt(1)){var g=c[f];c[f]=c[f+1],c[f+1]=g}c.reverse();for(var h=0;h<c.length;h++)b+="money"==c[h]?`${c[h]}=${a[c[h]]}`:`${c[h]}=${a[c[h]]}&`;var k=md5(b+secretkey);return this.sign=k,k}
export default{
	id,
	submitapi,
	queryapi,
	a,
	return_url,
}