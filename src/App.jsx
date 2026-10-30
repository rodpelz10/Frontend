import React from 'react';
import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowRight, Search, ChefHat, Leaf, Clock3, SlidersHorizontal,
  Plus, Pencil, Trash2, X, Check, Sparkles, Utensils, Heart,
  LayoutDashboard, CircleAlert, LoaderCircle, RefreshCw, ChevronRight
} from "lucide-react";
import { foodApi, orderApi, getApiError } from "./api";

const demoFoods = [
  { _id: "demo-1", name: "Chicken Adobo Bowl", description: "Tender chicken simmered in soy, vinegar and garlic, served with steamed rice.", price: 165, category: "Filipino", cuisine: "Filipino", ingredients: ["chicken", "garlic", "rice"], dietaryTags: [], imageUrl: "", available: true, rating: 4.8, popularity: 95 },
  { _id: "demo-2", name: "Garden Pesto Pasta", description: "Fresh basil pesto, cherry tomatoes and parmesan tossed with pasta.", price: 195, category: "Pasta", cuisine: "Italian", ingredients: ["basil", "tomato", "pasta"], dietaryTags: ["vegetarian"], imageUrl: "", available: true, rating: 4.7, popularity: 82 },
  { _id: "demo-3", name: "Crispy Tofu Rice Bowl", description: "Golden tofu with crunchy vegetables and a savory sesame dressing.", price: 145, category: "Healthy", cuisine: "Asian", ingredients: ["tofu", "vegetables", "rice"], dietaryTags: ["vegetarian"], imageUrl: "", available: true, rating: 4.6, popularity: 75 },
  { _id: "demo-4", name: "Classic Beef Burger", description: "Juicy beef patty, crisp lettuce, tomato and house sauce in a toasted bun.", price: 220, category: "Burgers", cuisine: "American", ingredients: ["beef", "lettuce", "tomato"], dietaryTags: [], imageUrl: "", available: true, rating: 4.5, popularity: 88 },
  { _id: "demo-5", name: "Mango Chicken Salad", description: "Grilled chicken, ripe mango, greens and a bright citrus dressing.", price: 180, category: "Healthy", cuisine: "Fusion", ingredients: ["chicken", "mango", "greens"], dietaryTags: ["gluten-free"], imageUrl: "", available: true, rating: 4.4, popularity: 69 },
  { _id: "demo-6", name: "Sinigang na Hipon", description: "Comforting sour tamarind broth with shrimp and garden vegetables.", price: 205, category: "Filipino", cuisine: "Filipino", ingredients: ["shrimp", "tamarind", "vegetables"], dietaryTags: [], imageUrl: "", available: true, rating: 4.9, popularity: 91 }
];

const palettes = ["peach", "sage", "lavender", "butter", "sky", "rose"];
const money = (amount) => `₱${Number(amount || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;

function useFoods(params = {}) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDemo, setUsingDemo] = useState(false);

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await foodApi.list(params);
      setFoods(response.data.data || []);
      setUsingDemo(false);
    } catch (err) {
      setFoods(demoFoods.filter((food) => food.available));
      setUsingDemo(true);
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [JSON.stringify(params)]);

  return { foods, setFoods, loading, error, usingDemo, reload };
}

function FoodArtwork({ food, index = 0, large = false }) {
  if (food.imageUrl) {
    return <div className={`food-art ${large ? "food-art-large" : ""} ${palettes[index % palettes.length]}`}>
      <img src={food.imageUrl} alt={food.name} onError={(event) => { event.currentTarget.style.display = "none"; }} />
      <span className="art-emoji" aria-hidden="true">🍽️</span>
    </div>;
  }
  const emoji = /chicken|adobo/i.test(food.name) ? "🍗"
    : /pasta|noodle/i.test(food.name) ? "🍝"
    : /tofu|salad|healthy/i.test(food.name) ? "🥗"
    : /burger/i.test(food.name) ? "🍔"
    : /shrimp|hipon|seafood/i.test(food.name) ? "🍤"
    : /pizza/i.test(food.name) ? "🍕" : ["🥘", "🍜", "🥑", "🍛", "🥙", "🍲"][index % 6];
  return <div className={`food-art ${large ? "food-art-large" : ""} ${palettes[index % palettes.length]}`}>
    <span className="food-emoji" aria-hidden="true">{emoji}</span>
    <span className="art-spark art-spark-one">✳</span>
    <span className="art-spark art-spark-two">✦</span>
  </div>;
}

function FoodCard({ food, index = 0, onFavorite, favorite = false }) {
  const [localFavorite, setLocalFavorite] = useState(favorite);
  return <article className="food-card">
    <Link to={`/foods/${food._id}`} className="food-card-art-link" aria-label={`View ${food.name}`}>
      <FoodArtwork food={food} index={index} />
    </Link>
    <button className={`favorite-button ${localFavorite ? "is-favorite" : ""}`} onClick={() => { setLocalFavorite((value) => !value); onFavorite?.(food._id); }} aria-label={localFavorite ? "Remove favorite" : "Add favorite"}>
      <Heart size={17} fill={localFavorite ? "currentColor" : "none"} />
    </button>
    <div className="food-card-body">
      <div className="food-meta"><span>{food.cuisine || food.category || "Chef's pick"}</span><span className="rating">★ {Number(food.rating || 4.5).toFixed(1)}</span></div>
      <Link to={`/foods/${food._id}`} className="food-title">{food.name}</Link>
      <p className="food-description">{food.description || "A delicious pick, freshly prepared and ready to enjoy."}</p>
      <div className="food-card-footer"><strong>{money(food.price)}</strong><Link className="round-arrow" to={`/foods/${food._id}`} aria-label={`View ${food.name}`}><ArrowRight size={17}/></Link></div>
    </div>
  </article>;
}

function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [location.pathname]);
  return <header className="site-header">
    <div className="header-inner">
      <Link to="/" className="brand"><span className="brand-mark"><Utensils size={19}/></span><span>crave<span className="brand-dot">.</span></span></Link>
      <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X/> : <SlidersHorizontal/>}</button>
      <nav className={mobileOpen ? "main-nav nav-open" : "main-nav"}>
        <NavLink to="/" end>Discover</NavLink>
        <NavLink to="/foods">Explore food</NavLink>
        <NavLink to="/recommendations">For you <Sparkles size={14}/></NavLink>
      </nav>
      <div style={{display:"flex",gap:12,alignItems:"center"}}><Link to="/sales" className="admin-link">Sales insights</Link><Link to="/admin-chatbot" className="admin-link">Admin assistant</Link><Link to="/admin" className="admin-link"><LayoutDashboard size={16}/> Manage menu <ArrowRight size={15}/></Link></div>
    </div>
  </header>;
}

function DemoNotice({ message, demo, onRetry }) {
  if (!message && !demo) return null;
  return <div className={`notice ${message ? "notice-warning" : "notice-demo"}`}>
    <CircleAlert size={17}/>
    <span>{message ? `${message} Showing sample food data where available.` : "Sample preview data is shown. Connect the backend to manage live records."}</span>
    {onRetry && <button onClick={onRetry} className="notice-retry"><RefreshCw size={14}/> Retry</button>}
  </div>;
}

function HomePage() {
  const { foods, loading, error, usingDemo, reload } = useFoods({ limit: 6, available: true });
  return <main>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-dot"/> GOOD FOOD, GOOD MOOD</span>
        <h1>Your next<br/>favorite meal<br/><em>is waiting.</em></h1>
        <p>Discover something delicious. Find feel-good food picked around your cravings, your budget, and your day.</p>
        <div className="hero-actions"><Link to="/foods" className="button button-dark">Explore the menu <ArrowRight size={17}/></Link><Link to="/recommendations" className="text-link">Find my food <Sparkles size={16}/></Link></div>
        <div className="hero-proof"><div className="proof-avatars"><span>🥑</span><span>🍜</span><span>🍓</span></div><div><strong>Made for your cravings</strong><small>Discover your next go-to meal</small></div></div>
      </div>
      <div className="hero-visual">
        <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
        <div className="hero-food-circle"><span className="hero-food-emoji">🥗</span></div>
        <div className="floating-note note-top"><span className="note-icon">✦</span><div><strong>Picked for you</strong><small>Good taste, great choice</small></div></div>
        <div className="floating-note note-bottom"><span className="note-big">₱</span><div><strong>Budget friendly</strong><small>Delicious doesn't mean pricey</small></div></div>
        <span className="hero-deco deco-one">✳</span><span className="hero-deco deco-two">✦</span>
      </div>
      <div className="hero-side-label">A LITTLE INSPIRATION FOR YOUR APPETITE ↗</div>
    </section>

    <section className="benefit-strip">
      <div><span className="benefit-icon"><Search size={19}/></span><span><strong>Find your craving</strong><small>Search your way</small></span></div>
      <div><span className="benefit-icon"><Sparkles size={19}/></span><span><strong>Made for you</strong><small>Personalized picks</small></span></div>
      <div><span className="benefit-icon"><Leaf size={19}/></span><span><strong>Fits your lifestyle</strong><small>Preferences matter</small></span></div>
      <div><span className="benefit-icon"><Clock3 size={19}/></span><span><strong>Easy discovery</strong><small>Less scrolling, more yum</small></span></div>
    </section>

    <section className="section content-section">
      <div className="section-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h2>Something delicious.</h2><p>Little favorites worth making room for.</p></div><Link to="/foods" className="text-link">See all food <ArrowRight size={16}/></Link></div>
      <DemoNotice message={error} demo={usingDemo} onRetry={reload}/>
      {loading ? <div className="loading-state"><LoaderCircle className="spin"/> Loading delicious things…</div> :
        <div className="food-grid">{foods.slice(0, 3).map((food, i) => <FoodCard key={food._id} food={food} index={i}/>)}</div>}
    </section>
    <section className="recommend-banner">
      <div className="banner-sticker">✦<br/><span>YUM</span></div>
      <div><span className="eyebrow">YOUR CRAVINGS, CONSIDERED</span><h2>Not sure what you're in the mood for?</h2><p>Tell us what sounds good, set your budget, and let your next meal find you.</p></div>
      <Link to="/recommendations" className="button button-light">Get my recommendations <ArrowRight size={17}/></Link>
    </section>
    <Footer/>
  </main>;
}

function FoodsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { foods, loading, error, usingDemo, reload } = useFoods({
    search: query || undefined,
    category: category || undefined,
    maxPrice: maxPrice || undefined,
    available: true,
    limit: 50
  });
  const categories = [...new Set([...demoFoods.map((f) => f.category), ...foods.map((f) => f.category)].filter(Boolean))].sort();

  const submitSearch = (event) => { event.preventDefault(); setQuery(search.trim()); };
  return <main className="page-shell">
    <div className="page-intro"><span className="eyebrow">THE MENU</span><h1>Find your <em>kind of delicious.</em></h1><p>Browse the menu, search a craving, and discover something new.</p></div>
    <form className="search-toolbar" onSubmit={submitSearch}>
      <div className="search-input-wrap"><Search size={19}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search meals, ingredients, cuisine…"/>{search && <button type="button" className="icon-button" onClick={() => { setSearch(""); setQuery(""); }} aria-label="Clear search"><X size={16}/></button>}</div>
      <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select>
      <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} aria-label="Filter by maximum price"><option value="">Any budget</option><option value="150">Under ₱150</option><option value="200">Under ₱200</option><option value="250">Under ₱250</option></select>
      <button className="button button-dark search-submit" type="submit"><Search size={16}/> Search</button>
    </form>
    <DemoNotice message={error} demo={usingDemo} onRetry={reload}/>
    <div className="results-heading"><span><strong>{foods.length}</strong> {foods.length === 1 ? "delicious find" : "delicious finds"}</span><span className="subtle-label"><SlidersHorizontal size={14}/> Made to explore</span></div>
    {loading ? <div className="loading-state"><LoaderCircle className="spin"/> Finding your food…</div> :
      foods.length ? <div className="food-grid food-grid-wide">{foods.map((food, i) => <FoodCard key={food._id} food={food} index={i}/>)}</div> :
      <EmptyState title="No bites found just yet" text="Try another search or loosen your filters." action="Clear filters" onAction={() => { setSearch(""); setQuery(""); setCategory(""); setMaxPrice(""); }}/>}
    <Footer/>
  </main>;
}

function RecommendationsPage() {
  const [cuisine, setCuisine] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("200");
  const [dietaryTag, setDietaryTag] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [demo, setDemo] = useState(false);

  const recommend = async (event) => {
    event?.preventDefault();
    setLoading(true); setError(""); setSearched(true);
    const params = { cuisine: cuisine || undefined, category: category || undefined, maxPrice: maxPrice || undefined, dietaryTag: dietaryTag || undefined };
    try {
      const response = await foodApi.recommendations(params);
      setResults(response.data.data || []);
      setDemo(false);
    } catch (err) {
      const budget = maxPrice ? Number(maxPrice) : Infinity;
      setResults(demoFoods.filter((food) => food.available &&
        (!cuisine || food.cuisine.toLowerCase() === cuisine.toLowerCase()) &&
        (!category || food.category.toLowerCase() === category.toLowerCase()) &&
        food.price <= budget &&
        (!dietaryTag || food.dietaryTags.some((tag) => tag.toLowerCase() === dietaryTag.toLowerCase()))
      ));
      setDemo(true);
      setError(getApiError(err));
    } finally { setLoading(false); }
  };

  return <main className="page-shell recommendation-page">
    <div className="page-intro"><span className="eyebrow"><Sparkles size={14}/> THE FOOD FINDER</span><h1>Let's find your <em>next favorite.</em></h1><p>A few little clues help us find something that fits your taste and budget.</p></div>
    <div className="finder-layout">
      <form className="finder-panel" onSubmit={recommend}>
        <div className="finder-panel-heading"><span className="finder-icon"><Sparkles size={20}/></span><div><h2>Your kind of meal</h2><p>Make it as specific or as spontaneous as you like.</p></div></div>
        <label className="field-label">What cuisine sounds good?</label>
        <div className="choice-chips">{["", "Filipino", "Italian", "Asian", "American"].map((item) => <button key={item || "any-cuisine"} type="button" onClick={() => setCuisine(item)} className={`choice-chip ${cuisine === item ? "selected" : ""}`}>{item || "Surprise me"}</button>)}</div>
        <label className="field-label" htmlFor="recommend-category">Meal category</label>
        <select id="recommend-category" className="full-field" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Anything sounds good</option><option>Filipino</option><option>Healthy</option><option>Pasta</option><option>Burgers</option></select>
        <div className="field-label-row"><label className="field-label" htmlFor="budget">What's your budget?</label><strong>{maxPrice ? `₱${Number(maxPrice).toLocaleString("en-PH")}` : "Any budget"}</strong></div>
        <input id="budget" className="budget-range" type="range" min="100" max="500" step="25" value={maxPrice || "500"} onChange={(e) => setMaxPrice(e.target.value)}/>
        <div className="range-labels"><span>₱100</span><span>₱500+</span></div>
        <label className="field-label" htmlFor="diet">Dietary preference</label>
        <select id="diet" className="full-field" value={dietaryTag} onChange={(e) => setDietaryTag(e.target.value)}><option value="">No preference</option><option value="vegetarian">Vegetarian</option><option value="gluten-free">Gluten-free</option><option value="vegan">Vegan</option></select>
        <button className="button button-dark button-full" type="submit"><Sparkles size={17}/> Find my food <ArrowRight size={17}/></button>
        <p className="privacy-note">Just good suggestions, based on the preferences you choose.</p>
      </form>
      <section className="recommend-results">
        {!searched ? <div className="recommend-empty"><div className="empty-illustration"><span>🥘</span><span>✦</span></div><span className="eyebrow">A LITTLE FOOD MAGIC</span><h2>Your next craving<br/>starts here.</h2><p>Choose what sounds good, then we'll find meals that fit.</p></div> :
          <><div className="results-heading"><div><span className="eyebrow">YOUR PERSONAL SHORTLIST</span><h2>{loading ? "Finding your matches…" : results.length ? "These look delicious." : "Let's try a different recipe."}</h2></div><span className="match-count">{results.length} matches</span></div>
          {error && <DemoNotice message={error} demo={demo}/>}
          {loading ? <div className="loading-state"><LoaderCircle className="spin"/> Matching your taste…</div> :
            results.length ? <div className="food-grid recommendation-grid">{results.map((food, i) => <FoodCard key={food._id} food={food} index={i}/>)}</div> :
            <EmptyState title="No exact matches yet" text="Try another cuisine, dietary option, or a bigger budget." action="Show all preferences" onAction={() => { setCuisine(""); setCategory(""); setDietaryTag(""); setMaxPrice("300"); }}/>}
          </>}
      </section>
    </div>
    <Footer/>
  </main>;
}

const emptyForm = { name: "", description: "", price: "", category: "Filipino", cuisine: "Filipino", ingredients: "", dietaryTags: "", imageUrl: "", available: true };

function AdminPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [usingDemo, setUsingDemo] = useState(false);

  const loadFoods = async () => {
    setLoading(true); setError("");
    try {
      const response = await foodApi.list({ limit: 100 });
      setFoods(response.data.data || []);
      setUsingDemo(false);
    } catch (err) {
      setError(getApiError(err));
      setFoods(demoFoods);
      setUsingDemo(true);
    } finally { setLoading(false); }
  };
  useEffect(() => { loadFoods(); }, []);

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); setNotice(""); };
  const openEdit = (food) => {
    setEditingId(food._id);
    setForm({
      name: food.name || "", description: food.description || "", price: String(food.price ?? ""),
      category: food.category || "", cuisine: food.cuisine || "", ingredients: (food.ingredients || []).join(", "),
      dietaryTags: (food.dietaryTags || []).join(", "), imageUrl: food.imageUrl || "", available: food.available !== false
    });
    setShowForm(true); setNotice("");
  };
  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((old) => ({ ...old, [name]: type === "checkbox" ? checked : value }));
  };
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const payload = {
      name: form.name.trim(), description: form.description.trim(), price: Number(form.price),
      category: form.category.trim(), cuisine: form.cuisine.trim(),
      ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      dietaryTags: form.dietaryTags.split(",").map((s) => s.trim()).filter(Boolean),
      imageUrl: form.imageUrl.trim(), available: form.available
    };
    try {
      if (editingId) await foodApi.update(editingId, payload);
      else await foodApi.create(payload);
      setShowForm(false); setEditingId(null); setForm(emptyForm);
      setNotice(editingId ? "Food item updated successfully." : "Food item added successfully.");
      await loadFoods();
    } catch (err) {
      setError(getApiError(err));
    } finally { setSaving(false); }
  };
  const remove = async (id) => {
    setError(""); setNotice("");
    try {
      await foodApi.remove(id);
      setConfirmDelete(null);
      setNotice("Food item deleted.");
      await loadFoods();
    } catch (err) { setError(getApiError(err)); setConfirmDelete(null); }
  };
  const filtered = foods.filter((food) => `${food.name} ${food.category} ${food.cuisine}`.toLowerCase().includes(search.toLowerCase()));

  return <main className="page-shell admin-page">
    <div className="admin-page-heading"><div><span className="eyebrow">ADMIN WORKSPACE</span><h1>Menu <em>management.</em></h1><p>Keep the good stuff fresh. Add, update, search and manage your food catalog.</p></div><button className="button button-dark" onClick={openAdd}><Plus size={18}/> Add food item</button></div>
    <div className="admin-stats"><div><span className="stat-label">Total menu items</span><strong>{foods.length}</strong><span className="stat-caption">Across your catalog</span></div><div><span className="stat-label">Available now</span><strong>{foods.filter((f) => f.available !== false).length}</strong><span className="stat-caption">Visible to customers</span></div><div><span className="stat-label">Categories</span><strong>{new Set(foods.map((f) => f.category).filter(Boolean)).size}</strong><span className="stat-caption">Ways to find a favorite</span></div></div>
    {usingDemo && <div className="notice notice-warning"><CircleAlert size={17}/><span>{error} You're viewing sample rows; add, edit and delete require a live backend.</span><button className="notice-retry" onClick={loadFoods}><RefreshCw size={14}/> Retry</button></div>}
    {notice && <div className="notice notice-success"><Check size={17}/><span>{notice}</span><button className="notice-close" onClick={() => setNotice("")}><X size={15}/></button></div>}
    {error && !usingDemo && <div className="notice notice-warning"><CircleAlert size={17}/><span>{error}</span><button className="notice-retry" onClick={loadFoods}><RefreshCw size={14}/> Retry</button></div>}
    <section className="admin-table-panel">
      <div className="table-toolbar"><div><h2>Your food catalog</h2><p>Manage item details and availability.</p></div><div className="table-search"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu…"/></div></div>
      {loading ? <div className="loading-state"><LoaderCircle className="spin"/> Loading menu…</div> :
      <div className="table-scroll"><table className="food-table"><thead><tr><th>Food item</th><th>Category</th><th>Price</th><th>Status</th><th className="actions-heading">Actions</th></tr></thead>
      <tbody>{filtered.map((food, i) => <tr key={food._id}><td><div className="table-food"><FoodArtwork food={food} index={i}/><div><strong>{food.name}</strong><small>{food.cuisine || "Cuisine not set"}</small></div></div></td><td>{food.category}</td><td className="table-price">{money(food.price)}</td><td><span className={`status-pill ${food.available === false ? "status-off" : ""}`}><span/>{food.available === false ? "Unavailable" : "Available"}</span></td><td><div className="table-actions"><button className="table-icon-button" onClick={() => openEdit(food)} title="Edit food" aria-label={`Edit ${food.name}`} disabled={usingDemo}><Pencil size={16}/></button><button className="table-icon-button delete-action" onClick={() => setConfirmDelete(food)} title="Delete food" aria-label={`Delete ${food.name}`} disabled={usingDemo}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>
      {!filtered.length && <EmptyState title="No menu items found" text="Try a different search or add a new food item." action="Add food item" onAction={openAdd}/>}</div>}
    </section>

    {showForm && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
      <section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="food-form-title">
        <div className="modal-heading"><div><span className="eyebrow">{editingId ? "UPDATE THE MENU" : "GROW THE MENU"}</span><h2 id="food-form-title">{editingId ? "Edit food item" : "Add a food item"}</h2><p>Give this delicious thing a place on the menu.</p></div><button className="icon-button modal-close" onClick={() => setShowForm(false)} aria-label="Close form"><X/></button></div>
        <form onSubmit={save} className="food-form">
          <label>Food name *<input name="name" value={form.name} onChange={change} required minLength="2" maxLength="100" placeholder="e.g. Chicken Adobo Bowl"/></label>
          <label>Description<textarea name="description" value={form.description} onChange={change} maxLength="1000" rows="3" placeholder="What makes this dish special?"/></label>
          <div className="form-row"><label>Price (₱) *<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required placeholder="150"/></label><label>Category *<input name="category" value={form.category} onChange={change} required placeholder="Filipino"/></label></div>
          <label>Cuisine<input name="cuisine" value={form.cuisine} onChange={change} placeholder="Filipino"/></label>
          <label>Ingredients <span className="label-hint">Separate with commas</span><input name="ingredients" value={form.ingredients} onChange={change} placeholder="chicken, garlic, rice"/></label>
          <label>Dietary tags <span className="label-hint">Separate with commas</span><input name="dietaryTags" value={form.dietaryTags} onChange={change} placeholder="vegetarian, gluten-free"/></label>
          <label>Image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={change} placeholder="https://…"/></label>
          <label className="availability-check"><input name="available" type="checkbox" checked={form.available} onChange={change}/> Available to customers</label>
          {error && <p className="form-error"><CircleAlert size={15}/>{error}</p>}
          <div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="button button-dark" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16}/> : <Check size={16}/>} {saving ? "Saving…" : editingId ? "Save changes" : "Add to menu"}</button></div>
        </form>
      </section>
    </div>}

    {confirmDelete && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><span className="confirm-icon"><Trash2 size={22}/></span><h2 id="delete-title">Remove this dish?</h2><p><strong>{confirmDelete.name}</strong> will be deleted from the food catalog. This action can't be undone.</p><div className="modal-actions"><button className="button button-outline" onClick={() => setConfirmDelete(null)}>Keep item</button><button className="button button-danger" onClick={() => remove(confirmDelete._id)}><Trash2 size={16}/> Delete item</button></div></section></div>}
    <Footer/>
  </main>;
}

function FoodDetailPage() {
  const id = window.location.pathname.split("/").filter(Boolean).pop();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    foodApi.get(id).then((response) => { if (active) setFood(response.data.data); })
      .catch((err) => {
        const demoFood = demoFoods.find((item) => item._id === id);
        if (active) { setFood(demoFood || null); setError(demoFood ? "" : getApiError(err)); }
      }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  if (loading) return <main className="page-shell"><div className="loading-state"><LoaderCircle className="spin"/> Loading food details…</div></main>;
  if (!food) return <main className="page-shell"><EmptyState title="We couldn't find that dish" text={error || "This food item may have been removed."} action="Back to menu" onAction={() => window.location.assign("/foods")}/></main>;
  return <main className="page-shell detail-page"><Link to="/foods" className="back-link">← Back to menu</Link><div className="detail-layout"><FoodArtwork food={food} large/><div className="detail-copy"><span className="eyebrow">{food.cuisine || food.category}</span><h1>{food.name}</h1><div className="detail-rating">★ {Number(food.rating || 4.5).toFixed(1)} <span>·</span> {food.available === false ? "Currently unavailable" : "A menu favorite"}</div><p>{food.description || "A delicious meal waiting to be discovered."}</p><strong className="detail-price">{money(food.price)}</strong><div className="detail-tags">{(food.dietaryTags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>{food.ingredients?.length > 0 && <div className="ingredients"><h3>What's in it</h3><p>{food.ingredients.join(" · ")}</p></div>}<Link to="/recommendations" className="button button-dark">Find similar favorites <Sparkles size={16}/></Link></div></div><Footer/></main>;
}

function EmptyState({ title, text, action, onAction }) {
  return <div className="empty-state"><span className="empty-state-icon">🍽️</span><h3>{title}</h3><p>{text}</p>{action && <button className="button button-outline" onClick={onAction}>{action} <ArrowRight size={15}/></button>}</div>;
}

function Footer() {
  return <footer className="site-footer"><Link to="/" className="brand"><span className="brand-mark"><Utensils size={17}/></span><span>crave<span className="brand-dot">.</span></span></Link><span>Find your next favorite. Made with a little appetite.</span><Link to="/recommendations">Food finder <ChevronRight size={14}/></Link></footer>;
}


function AdminChatbot() {
  const storageKey = "food-admin-chat-history";
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) && saved.length ? saved : [{ role: "assistant", text: "Hi! I can analyze your live menu and orders. Try asking: ‘What are the best sellers?’, ‘How much revenue do we have?’, or ‘Which foods are available?’" }];
    } catch { return [{ role: "assistant", text: "Hi! Ask me about your foods, sales, orders, or menu categories." }]; }
  });

  const loadData = async () => {
    setLoadingData(true); setDataError("");
    const problems = [];
    try {
      const response = await foodApi.list({ limit: 500 });
      setFoods(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (err) { problems.push(`Foods: ${getApiError(err)}`); setFoods(demoFoods); }
    try {
      if (orderApi?.list) {
        const response = await orderApi.list({ limit: 500 });
        const body = response?.data?.data;
        setOrders(Array.isArray(body) ? body : Array.isArray(body?.orders) ? body.orders : []);
      } else { setOrders([]); problems.push("The orders API is not available in ./api yet."); }
    } catch (err) { setOrders([]); problems.push(`Orders: ${getApiError(err)}`); }
    if (problems.length) setDataError(problems.join(" "));
    setLoadingData(false);
  };
  useEffect(() => { loadData(); }, []);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(messages.slice(-80))); } catch {} }, [messages]);

  const analyze = (question) => {
    const q = String(question || "").trim();
    const normalized = (value) => String(value ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const nq = normalized(q);

    // Handle greetings and everyday conversation before interpreting a message as a data query.
    // This prevents words like "hi" or "hello" from falling through to the menu-analysis response.
    if (/^(hi|hii+|hello+|hey+|heya|howdy|yo|good morning|good afternoon|good evening|morning|afternoon|evening)( there)?$/.test(nq)) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
      return `${greeting}! 👋 I'm your Crave admin assistant. I can help you check food prices and availability, review sales, summarize orders, and find best sellers. What would you like to know?`;
    }
    if (/^(how are you|how are you doing|how is it going|whats up|what is up|how are things)$/.test(nq)) {
      return "I'm doing well and ready to help! 😊 I can look up menu items, prices, availability, sales, and order statuses. What can I check for you?";
    }
    if (/^(thanks|thank you|thankyou|thx|ty|thanks a lot|thank you so much)$/.test(nq)) {
      return "You're welcome! 😊 Let me know if you'd like me to check another food item, price, order, or sales figure.";
    }
    if (/^(bye|goodbye|see you|see you later|gotta go|thats all|that is all)$/.test(nq)) {
      return "Goodbye! 👋 I'll be here whenever you need help with the menu, orders, or sales.";
    }
    if (/^(help|what can you do|what do you do|what can i ask|show help|commands)$/.test(nq)) {
      return "Here's what I can help with:\n• Food details: “How much is Chicken Adobo Bowl?”\n• Availability: “Is Garden Pesto Pasta available?”\n• Budget: “Show foods under ₱200.”\n• Menu: “List all foods with prices and availability.”\n• Sales: “Show sales overview.”\n• Orders: “How many pending orders?”\n• Best sellers: “What are the most ordered foods?”\n• Categories and diets: “Show vegetarian foods.”\n\nYou can ask naturally—there's no need to use an exact command.";
    }

    const amount = (value) => {
      const number = Number(value);
      return Number.isFinite(number) ? number : 0;
    };
    const orderTotal = (order) => amount(order.totalAmount ?? order.total ?? order.grandTotal ?? order.amount ?? order.price);
    const statusOf = (order) => String(order.status ?? order.orderStatus ?? "unknown").toLowerCase();
    const availableFoods = foods.filter((food) => food.available === true || (food.available == null && !/^(unavailable|out of stock|sold out|inactive)$/i.test(String(food.availability ?? food.status ?? ""))));
    const unavailableFoods = foods.filter((food) => food.available === false || /^(unavailable|out of stock|sold out|inactive|false|no)$/i.test(String(food.availability ?? food.status ?? "")));
    const revenueOrders = orders.filter((order) => !/(cancel|reject|refund)/i.test(statusOf(order)));
    const revenue = revenueOrders.reduce((sum, order) => sum + orderTotal(order), 0);
    const statusCounts = orders.reduce((acc, order) => {
      const status = statusOf(order);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const foodCounts = {};
    orders.forEach((order) => {
      const items = order.items || order.foods || order.orderItems || [];
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        const name = item.name || item.food?.name || item.foodName || item.title || "Unknown item";
        const qty = amount(item.quantity ?? item.qty ?? 1);
        foodCounts[name] = (foodCounts[name] || 0) + qty;
      });
    });
    const topFoods = Object.entries(foodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const counts = (field) => Object.entries(availableFoods.reduce((acc, food) => {
      const key = food[field] || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})).sort((a, b) => b[1] - a[1]);

    // Find a specific menu item before processing general menu questions.
    const foodName = (food) => normalized(food.name);
    const menu = [...foods].filter((food) => food?.name).sort((a, b) => foodName(b).length - foodName(a).length);
    let matchedFood = menu.find((food) => {
      const name = foodName(food);
      return name && (` ${nq} `).includes(` ${name} `);
    });

    // Tolerate one-character typos, but only when the question contains likely food-name words.
    const editDistance = (a, b) => {
      const row = Array.from({ length: b.length + 1 }, (_, i) => i);
      for (let i = 1; i <= a.length; i++) {
        let diagonal = row[0];
        row[0] = i;
        for (let j = 1; j <= b.length; j++) {
          const old = row[j];
          row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
          diagonal = old;
        }
      }
      return row[b.length];
    };
    if (!matchedFood && nq.length >= 4) {
      const stopWords = new Set(["how", "much", "what", "price", "cost", "available", "availability", "tell", "about", "show", "give", "please", "food", "foods", "dish", "dishes", "item", "items", "menu", "the", "for", "does", "have", "with", "check", "find", "is", "are", "and", "its", "currently", "can", "order", "list", "all", "name", "named", "called", "details", "ingredients", "describe", "description"]);
      const words = nq.split(/\s+/).filter((word) => word.length > 2 && !stopWords.has(word));
      let best = null;
      let bestScore = 0;
      if (words.length) {
        for (const food of menu) {
          const nameWords = foodName(food).split(/\s+/);
          const matched = nameWords.filter((nameWord) => words.some((word) => word === nameWord || (Math.min(word.length, nameWord.length) >= 4 && editDistance(word, nameWord) <= 1))).length;
          const score = matched / Math.max(nameWords.length, 1);
          if (score > bestScore) { best = food; bestScore = score; }
        }
        if (bestScore >= 0.6) matchedFood = best;
      }
    }

    const asksPrice = /\b(price|cost|how much|much is|priced|php|peso|pesos|worth|expensive|cheap)\b|₱/i.test(q);
    const asksAvailability = /\b(available|availability|in stock|sold out|unavailable|can i order|orderable|stock|still have)\b/i.test(q);
    const asksDetails = /\b(describe|description|ingredients|contains|tell me about|details|category|cuisine|dietary|what is|information)\b/i.test(q);
    const asksSpecificFood = matchedFood && (asksPrice || asksAvailability || asksDetails || nq === foodName(matchedFood) || /\b(this food|this dish|that food|that dish|what about|tell me|show me|check)\b/i.test(q));

    if (asksSpecificFood) {
      const rawPrice = matchedFood.price ?? matchedFood.cost ?? matchedFood.unitPrice ?? matchedFood.amount;
      const parsedPrice = rawPrice === "" || rawPrice == null ? NaN : Number(rawPrice);
      const availabilityValue = matchedFood.available ?? matchedFood.isAvailable ?? matchedFood.availability ?? matchedFood.inStock ?? matchedFood.status;
      let availabilityText = "Not specified in the menu data";
      if (availabilityValue === true || /^(true|yes|available|in stock|active)$/i.test(String(availabilityValue))) availabilityText = "Available";
      else if (availabilityValue === false || /^(false|no|unavailable|out of stock|sold out|inactive)$/i.test(String(availabilityValue))) availabilityText = "Unavailable";
      const details = [`Food: ${matchedFood.name}`, `Price: ${Number.isFinite(parsedPrice) ? money(parsedPrice) : "No price recorded in the menu data"}`, `Availability: ${availabilityText}`];
      if (matchedFood.category) details.push(`Category: ${matchedFood.category}`);
      if (matchedFood.cuisine) details.push(`Cuisine: ${matchedFood.cuisine}`);
      if (matchedFood.description) details.push(`Description: ${matchedFood.description}`);
      if (Array.isArray(matchedFood.ingredients) && matchedFood.ingredients.length) details.push(`Ingredients: ${matchedFood.ingredients.join(", ")}`);
      if (Array.isArray(matchedFood.dietaryTags) && matchedFood.dietaryTags.length) details.push(`Dietary tags: ${matchedFood.dietaryTags.join(", ")}`);
      return details.join("\n");
    }

    if (/refresh|reload|update data|latest data/.test(nq)) return "Please use the Refresh data button above to reload the latest food and order records.";
    if (/best.?sell|popular|top food|most ordered|top item/.test(nq)) return topFoods.length ? `Top ordered items (based on item names in the orders data):\n${topFoods.map(([name, count], i) => `${i + 1}. ${name} — ${count} item(s)`).join("\n")}` : `I couldn't calculate best sellers because your order records don't expose item names in a recognized format. I can see ${orders.length} order(s).`;
    if (/revenue|sales|income|earned|total amount/.test(nq)) return `Sales overview:\n• Orders loaded: ${orders.length}\n• Non-cancelled/non-refunded orders used for the estimate: ${revenueOrders.length}\n• Estimated revenue from order totals: ${money(revenue)}\n• Average order value: ${money(revenueOrders.length ? revenue / revenueOrders.length : 0)}\n\nThis estimate depends on the total field available in each order record.`;
    if (/order status|pending|delivered|cancelled|canceled|processing|order count|how many orders/.test(nq)) return `Order status summary (${orders.length} total):\n${Object.keys(statusCounts).length ? Object.entries(statusCounts).map(([status, count]) => `• ${status}: ${count}`).join("\n") : "No order status data was returned."}`;
    if (/unavailable|out of stock|sold out/.test(nq)) return `Unavailable foods (${unavailableFoods.length}):\n${unavailableFoods.map((food) => `• ${food.name} — ${food.price != null ? money(food.price) : "price not recorded"}`).join("\n") || "No unavailable items were reported by the menu data."}`;
    if (/category|categories/.test(nq)) return `Available food by category:\n${counts("category").map(([name, count]) => `• ${name}: ${count}`).join("\n") || "No available foods found."}`;
    if (/cuisine/.test(nq)) return `Available food by cuisine:\n${counts("cuisine").map(([name, count]) => `• ${name}: ${count}`).join("\n") || "No available foods found."}`;
    if (/vegetarian|vegan|gluten.?free|dietary|tag/.test(nq)) {
      const tag = nq.includes("vegan") ? "vegan" : nq.includes("gluten") ? "gluten-free" : "vegetarian";
      const matches = availableFoods.filter((food) => (food.dietaryTags || []).some((value) => String(value).toLowerCase().includes(tag)));
      return `${tag} foods available (${matches.length}):\n${matches.map((food) => `• ${food.name} — ${money(food.price)}`).join("\n") || "No matching food items found."}`;
    }
    if (/all foods|all menu|every food|list foods|list all|menu list|all items|all food items/.test(nq)) return `Menu items (${foods.length}):\n${foods.map((food) => `• ${food.name} — ${food.price != null ? money(food.price) : "price not recorded"} — ${(food.available === false || /^(unavailable|out of stock|sold out|inactive|false|no)$/i.test(String(food.availability ?? food.status ?? ""))) ? "Unavailable" : food.available === true ? "Available" : "Availability not specified"}`).join("\n") || "No food records returned."}`;
    if (/under|below|less than|budget|cheap|cheapest/.test(nq)) {
      const budget = q.match(/(?:under|below|less than|budget of|within|cheaper than)\s*(?:₱|php|p)?\s*(\d+(?:\.\d+)?)/i);
      if (budget) {
        const matches = availableFoods.filter((food) => Number.isFinite(Number(food.price)) && Number(food.price) <= Number(budget[1])).sort((a, b) => Number(a.price) - Number(b.price));
        return `Available foods priced at or under ${money(Number(budget[1]))} (${matches.length}):\n${matches.map((food) => `• ${food.name} — ${money(food.price)}`).join("\n") || "No available foods match that budget."}`;
      }
    }
    if (/available|menu|food|dish|item|price/.test(nq)) return `Available foods (${availableFoods.length}):\n${availableFoods.slice(0, 50).map((food) => `• ${food.name} — ${food.price != null ? money(food.price) : "price not recorded"}`).join("\n") || "No available foods found."}`;
    if (/overview|summary|dashboard|how is the business|analytics/.test(nq)) return `Live overview:\n• Menu items: ${foods.length}\n• Available: ${availableFoods.length}\n• Unavailable: ${unavailableFoods.length}\n• Orders: ${orders.length}\n• Estimated revenue: ${money(revenue)}\n• Average order value: ${money(revenueOrders.length ? revenue / revenueOrders.length : 0)}\n\nAsk about sales, order status, categories, cuisine, or a specific food's price and availability.`;
    return "I'm not quite sure what you're asking yet, but I can help! 😊 Try asking about a food's price or availability, foods under a budget, sales, order statuses, best sellers, categories, cuisine, or dietary tags. Type “help” to see examples.";
  };

  const send = (event) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question || isTyping) return;
    // Add the user's message immediately, then show a typing indicator for 2.5 seconds.
    setMessages(old => [...old, { role: "user", text: question }].slice(-80));
    setInput("");
    setIsTyping(true);
    window.setTimeout(() => {
      const answer = analyze(question);
      setMessages(old => [...old, { role: "assistant", text: answer }].slice(-80));
      setIsTyping(false);
    }, 2500);
  };
  const clearHistory = () => {
    const fresh = [{ role: "assistant", text: "Chat history cleared. Ask me about your live menu and order data." }];
    setMessages(fresh);
    setIsTyping(false);
  };

  return <main className="page-shell admin-page" style={{maxWidth:1000}}>
    <div className="page-intro"><span className="eyebrow">ADMIN WORKSPACE</span><h1>Admin <em>assistant.</em></h1><p>Ask questions about your food catalog, orders, and sales. Chat history is saved in this browser.</p></div>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
      <button className="button button-dark" onClick={loadData} disabled={loadingData}><RefreshCw size={16} className={loadingData ? "spin" : ""}/> {loadingData ? "Refreshing…" : "Refresh data"}</button>
      <button className="button button-outline" onClick={clearHistory}>Clear chat history</button>
      <span style={{fontSize:13,color:"#666"}}>{foods.length} food items · {orders.length} orders {loadingData ? "· Loading live data…" : "· Data loaded"}</span>
    </div>
    {dataError && <div className="notice notice-warning"><CircleAlert size={17}/><span>{dataError}</span></div>}
    <section style={{border:"1px solid #e7e1d8",borderRadius:18,overflow:"hidden",background:"#fff",boxShadow:"0 8px 28px #3427160a"}}>
      <div style={{padding:"16px 20px",background:"#f8f5ef",borderBottom:"1px solid #e7e1d8"}}><strong>Crave admin chat</strong><div style={{fontSize:13,color:"#6d6a63",marginTop:4}}>Answers are calculated from the records returned by your API, not an external AI service.</div></div>
      <div aria-live="polite" style={{padding:18,minHeight:320,maxHeight:480,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
        {messages.map((message,index)=><div key={`${index}-${message.role}`} style={{alignSelf:message.role === "user" ? "flex-end" : "flex-start",maxWidth:"88%",background:message.role === "user" ? "#2f382c" : "#f5f1e9",color:message.role === "user" ? "white" : "#25251f",padding:"12px 15px",borderRadius:14,whiteSpace:"pre-wrap",lineHeight:1.55,fontSize:14}}><div style={{fontSize:11,fontWeight:700,opacity:.7,marginBottom:5}}>{message.role === "user" ? "YOU" : "ADMIN ASSISTANT"}</div>{message.text}</div>)}
        {isTyping && <div role="status" aria-label="AI is typing" style={{alignSelf:"flex-start",maxWidth:"88%",background:"#f5f1e9",color:"#25251f",padding:"12px 15px",borderRadius:14,fontSize:14}}><div style={{fontSize:11,fontWeight:700,opacity:.7,marginBottom:7}}>ADMIN ASSISTANT</div><div style={{display:"flex",alignItems:"center",gap:5}}><span>Typing</span><span className="typing-dot" style={{animation:"typingPulse 1s infinite",fontSize:20,lineHeight:1}}>·</span><span className="typing-dot" style={{animation:"typingPulse 1s .2s infinite",fontSize:20,lineHeight:1}}>·</span><span className="typing-dot" style={{animation:"typingPulse 1s .4s infinite",fontSize:20,lineHeight:1}}>·</span></div></div>}
      </div>
      <form onSubmit={send} style={{display:"flex",gap:10,padding:14,borderTop:"1px solid #e7e1d8"}}><input aria-label="Ask the admin assistant" value={input} onChange={e=>setInput(e.target.value)} disabled={isTyping} placeholder={isTyping ? "Assistant is typing…" : "Ask about sales, orders, best sellers…"} style={{flex:1,minWidth:0,padding:"12px 14px",border:"1px solid #dcd5ca",borderRadius:10,font:"inherit"}}/><button className="button button-dark" type="submit" disabled={isTyping || !input.trim()}><ArrowRight size={16}/> {isTyping ? "Replying…" : "Send"}</button></form>
    </section>
    <p style={{fontSize:12,color:"#777",marginTop:12}}>Tip: ask “show sales overview”, “how many pending orders?”, “best sellers”, or “vegetarian foods”.</p>
    <Footer/>
  </main>;
}

function SalesInsightsPage() {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    setLoading(true); setError("");
    const issues = [];
    try { const r = await foodApi.list({limit:500}); setFoods(r?.data?.data || []); } catch(e) { issues.push(getApiError(e)); }
    try { if (orderApi?.list) { const r = await orderApi.list({limit:500}); const d=r?.data?.data; setOrders(Array.isArray(d)?d:Array.isArray(d?.orders)?d.orders:[]); } } catch(e) { issues.push(getApiError(e)); }
    setError(issues.join(" ")); setLoading(false);
  };
  useEffect(() => { refresh(); }, []);
  const revenueOrders = orders.filter(o => !/(cancel|reject|refund)/i.test(String(o.status || o.orderStatus || "")));
  const revenue = revenueOrders.reduce((sum,o)=>sum+Number(o.totalAmount ?? o.total ?? o.grandTotal ?? o.amount ?? 0),0);
  const statusCounts = orders.reduce((a,o)=>{const k=String(o.status || o.orderStatus || "Unknown");a[k]=(a[k]||0)+1;return a;},{});
  return <main className="page-shell admin-page"><div className="page-intro"><span className="eyebrow">ADMIN WORKSPACE</span><h1>Sales <em>insights.</em></h1><p>A quick summary based on your order and food API records.</p></div>
    <button className="button button-dark" onClick={refresh} disabled={loading}><RefreshCw size={16} className={loading?"spin":""}/> Refresh insights</button>
    {error && <div className="notice notice-warning" style={{marginTop:16}}><CircleAlert size={17}/><span>{error}</span></div>}
    {loading ? <div className="loading-state"><LoaderCircle className="spin"/> Loading sales data…</div> : <><div className="admin-stats" style={{marginTop:20}}><div><span className="stat-label">Orders</span><strong>{orders.length}</strong><span className="stat-caption">Records returned by API</span></div><div><span className="stat-label">Estimated revenue</span><strong>{money(revenue)}</strong><span className="stat-caption">Excludes cancelled/refunded</span></div><div><span className="stat-label">Available menu items</span><strong>{foods.filter(f=>f.available!==false).length}</strong><span className="stat-caption">Out of {foods.length} total foods</span></div></div><section className="admin-table-panel" style={{marginTop:20,padding:20}}><h2>Order status breakdown</h2>{Object.keys(statusCounts).length ? Object.entries(statusCounts).map(([status,count])=><div key={status} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #eee"}}><span>{status}</span><strong>{count}</strong></div>) : <p>No order status data available.</p>}</section></>}
    <Footer/>
  </main>;
}


function NotFound() {
  return <main className="page-shell"><EmptyState title="This page wandered off" text="Let's get you back to something delicious." action="Back to home" onAction={() => window.location.assign("/")}/></main>;
}

export default function App() {
  return <><Header/><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/foods" element={<FoodsPage/>}/>
    <Route path="/foods/:id" element={<FoodDetailPage/>}/>
    <Route path="/recommendations" element={<RecommendationsPage/>}/>
    <Route path="/admin" element={<AdminPage/>}/>
    <Route path="/admin-chatbot" element={<AdminChatbot/>}/>
    <Route path="/sales" element={<SalesInsightsPage/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes></>;
}