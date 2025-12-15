const Express = require('express');
const app = Express(); 
const cors = require('cors')
app.use(Express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const Routes = require('./src/Routes/Login.Routes')
app.use('/api', Routes)

app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
});