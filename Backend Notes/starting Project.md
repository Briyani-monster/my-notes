
```
const express=require('express');
const app=express();
app.use("/",(req,res,next)=>{
	res.render("filepath",{
		key:value
	});
});
app.listen(3000)
```