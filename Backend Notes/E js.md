
`head.ejs`

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%= pageTitle %></title>
    <link rel="stylesheet" href="/css/main.css">
```

`navigation.ejs`
```
<div class="backdrop"></div>
<header class="main-header">
    <button id="side-menu-toggle">Menu</button>
    <nav class="main-header__nav">
        <ul class="main-header__item-list">
            <li class="main-header__item">
                <a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/products' ? 'active' : '' %>" href="/products">Products</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/cart' ? 'active' : '' %>" href="/cart">Cart</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/orders' ? 'active' : '' %>" href="/orders">Orders</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add Product
                </a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/admin/products' ? 'active' : '' %>" href="/admin/products">Admin Products
                </a>
            </li>
        </ul>
    </nav>
</header>

<nav class="mobile-nav">
        <ul class="mobile-nav__item-list">
                <li class="mobile-nav__item">
                    <a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/products' ? 'active' : '' %>" href="/products">Products</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/cart' ? 'active' : '' %>" href="/cart">Cart</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/orders' ? 'active' : '' %>" href="/orders">Orders</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add Product
                    </a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/admin/products' ? 'active' : '' %>" href="/admin/products">Admin Products
                    </a>
                </li>
            </ul>
</nav>
```

`404.ejs`

```
<%- include('includes/head.ejs') %>
	</head>
	<body>
<%- include('includes/navigation.ejs') %>
    <h1>Page Not Found!</h1>
<%- include('includes/end.ejs') %>
```

`end.ejs`
```
<script src="/js/main.js"></script>
</body>
</html>
```