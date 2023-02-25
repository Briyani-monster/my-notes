
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

```
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
})
```
