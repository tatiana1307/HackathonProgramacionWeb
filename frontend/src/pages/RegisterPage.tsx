import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterData, PasswordStrength } from '../types';

const RegisterPage: React.FC = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: '',
    color: 'danger'
  });
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      checkPasswordMatch(name === 'password' ? value : formData.password, name === 'confirmPassword' ? value : formData.confirmPassword);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';
    let color: 'danger' | 'warning' | 'info' | 'success' = 'danger';

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length === 0) {
      feedback = '';
    } else if (score <= 1) {
      feedback = 'Contraseña débil';
      color = 'danger';
    } else if (score === 2) {
      feedback = 'Contraseña media';
      color = 'warning';
    } else if (score === 3) {
      feedback = 'Contraseña buena';
      color = 'info';
    } else if (score >= 4) {
      feedback = 'Contraseña muy segura';
      color = 'success';
    }

    setPasswordStrength({ score, feedback, color });
  };

  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    if (confirmPassword.length === 0) {
      setPasswordMatch(null);
    } else {
      setPasswordMatch(password === confirmPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password !== formData.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error: any) {
      setFormError(error.message || 'Error al registrarse');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          {/* Título */}
          <div className="title-container mb-4">
            <h1 className="main-title">
              <span className="title-icon">📚</span>
              <span className="title-text">Biblioteca Digital</span>
              <span className="title-subtitle">Conceptos de Ingeniería de Sistemas</span>
            </h1>
          </div>

          {/* Formulario de Registro */}
          <Card className="shadow">
            <Card.Header className="register-header text-white text-center">
              <h3 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>Registrarse
              </h3>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              {formError && (
                <Alert variant="danger" className="mb-3">
                  {formError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-person me-1"></i>Nombre completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese su nombre completo"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-envelope me-1"></i>Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingrese su correo"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-telephone me-1"></i>Teléfono
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ingrese su teléfono"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-lock me-1"></i>Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <ProgressBar 
                    className="mt-2" 
                    style={{ height: '8px' }}
                    now={passwordStrength.score * 25} 
                    variant={passwordStrength.color}
                  />
                  <small className={`form-text text-${passwordStrength.color}`}>
                    {passwordStrength.feedback}
                  </small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-lock-fill me-1"></i>Confirmar contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme su contraseña"
                    required
                  />
                  <small className={`form-text ${passwordMatch === null ? '' : passwordMatch ? 'text-success' : 'text-danger'}`}>
                    {passwordMatch === null ? '' : passwordMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                  </small>
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    className="register-btn btn-lg"
                    disabled={loading || passwordMatch === false}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>Registrarse
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
