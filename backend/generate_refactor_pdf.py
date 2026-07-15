from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted

content = [
    ('title', 'Exemple de refactorisation backend'),
    ('h2', 'Structure proposée'),
    ('text', 'backend/\n  app.js\n  server.js\n  routes/\n    auth.route.js\n  controllers/\n    auth.controller.js\n  services/\n    auth.service.js\n  repositories/\n    user.repository.js\n  middlewares/\n    asyncHandler.js\n    validateRequest.js\n    errorHandler.js\n  helpers/\n    jwt.js\n  config/\n    db.js\n    env.js'),
    ('h2', 'server.js'),
    ('code', """const app = require('./app');\nconst db = require('./config/db');\nconst PORT = process.env.PORT || 5000;\n\nasync function start() {\n  try {\n    await db.query('SELECT 1');\n  } catch (err) {\n    console.error('DB startup error:', err.message || err);\n    process.exit(1);\n  }\n\n  app.listen(PORT, () => {\n    console.log(`Server listening on port ${PORT}`);\n  });\n}\n\nstart();"""),
    ('h2', 'app.js'),
    ('code', """const express = require('express');\nconst cors = require('cors');\nconst helmet = require('helmet');\nconst rateLimit = require('express-rate-limit');\nconst authRouter = require('./routes/auth.route');\nconst errorHandler = require('./middlewares/errorHandler');\n\nconst app = express();\n\napp.use(cors());\napp.use(express.json());\napp.use(helmet());\napp.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));\n\napp.use('/api/auth', authRouter);\n\napp.use(errorHandler);\n\nmodule.exports = app;"""),
    ('h2', 'auth.route.js'),
    ('code', """const router = require('express').Router();\nconst authController = require('../controllers/auth.controller');\nconst validateRequest = require('../middlewares/validateRequest');\nconst { registerSchema, loginSchema } = require('../validators/auth.validator');\n\nrouter.post('/register', validateRequest(registerSchema), authController.register);\nrouter.post('/login', validateRequest(loginSchema), authController.login);\n\nmodule.exports = router;"""),
    ('h2', 'auth.controller.js'),
    ('code', """const authService = require('../services/auth.service');\n\nmodule.exports.register = async (req, res, next) => {\n  try {\n    const user = await authService.register(req.body);\n    return res.status(201).json({ msg: 'Registered successfully', user });\n  } catch (err) {\n    next(err);\n  }\n};\n\nmodule.exports.login = async (req, res, next) => {\n  try {\n    const token = await authService.login(req.body);\n    return res.status(200).json({ msg: 'Login successfully', token });\n  } catch (err) {\n    next(err);\n  }\n};"""),
    ('h2', 'auth.service.js'),
    ('code', """const userRepository = require('../repositories/user.repository');\nconst bcrypt = require('bcrypt');\nconst { generateToken } = require('../helpers/jwt');\nconst ApiError = require('../errors/ApiError');\n\nmodule.exports.register = async ({ email, fullName, password }) => {\n  const existing = await userRepository.findByEmail(email);\n  if (existing) {\n    throw ApiError.conflict('Email is already registered');\n  }\n\n  const hashedPassword = await bcrypt.hash(password, 10);\n  const user = await userRepository.create({ email, fullName, password: hashedPassword });\n\n  return {\n    id: user.id,\n    email: user.email,\n    fullName: user.fullName,\n    token: generateToken(user.id),\n  };\n};\n\nmodule.exports.login = async ({ email, password }) => {\n  const user = await userRepository.findByEmail(email);\n  if (!user) {\n    throw ApiError.badRequest('Invalid credentials');\n  }\n\n  const isValid = await bcrypt.compare(password, user.password);\n  if (!isValid) {\n    throw ApiError.unauthorized('Invalid credentials');\n  }\n\n  return {\n    token: generateToken(user.id),\n    user: { id: user.id, email: user.email },\n  };\n};"""),
    ('h2', 'user.repository.js'),
    ('code', """const { query } = require('../config/db');\n\nmodule.exports.findByEmail = async (email) => {\n  const result = await query('SELECT id, email, fullName, password FROM users WHERE email = $1', [email]);\n  return result.rows[0];\n};\n\nmodule.exports.create = async ({ email, fullName, password }) => {\n  const result = await query(\n    'INSERT INTO users (email, fullName, password) VALUES ($1, $2, $3) RETURNING id, email, fullName',\n    [email, fullName, password]\n  );\n  return result.rows[0];\n};"""),
    ('h2', 'jwt.js'),
    ('code', """const jwt = require('jsonwebtoken');\n\nmodule.exports.generateToken = (id) => {\n  const secret = process.env.JWT_SECRET || process.env.SECRET_TOKEN;\n  if (!secret) throw new Error('JWT secret missing');\n  return jwt.sign({ id }, secret, { expiresIn: '30d', algorithm: 'HS256' });\n};"""),
]

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='RefactorCode', fontName='Courier', fontSize=8, leading=10, leftIndent=0, spaceBefore=6, spaceAfter=6))
styles.add(ParagraphStyle(name='RefactorHeading2', parent=styles['Heading2'], spaceAfter=6))

pdf_path = 'c:\\Users\\Admin\\Desktop\\dev\\biblio-lab\\backend\\refactor-example.pdf'

doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
flowables = []
for kind, text in content:
    if kind == 'title':
        flowables.append(Paragraph(text, styles['Title']))
        flowables.append(Spacer(1, 12))
    elif kind == 'h2':
        flowables.append(Paragraph(text, styles['RefactorHeading2']))
    elif kind == 'text':
        for line in text.split('\n'):
            flowables.append(Paragraph(line, styles['Normal']))
        flowables.append(Spacer(1, 6))
    elif kind == 'code':
        flowables.append(Preformatted(text, styles['RefactorCode']))
        flowables.append(Spacer(1, 12))


doc.build(flowables)
print('PDF generated at', pdf_path)
