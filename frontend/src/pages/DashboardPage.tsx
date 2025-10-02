import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

interface SubjectButton {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const subjects: SubjectButton[] = [
    {
      id: 'estructuras-datos',
      title: 'Estructuras de Datos',
      description: 'Arrays, listas, pilas, colas, árboles y grafos',
      icon: '📊',
      color: 'primary',
      gradient: 'linear-gradient(135deg, #a8c8ec 0%, #b8d4f0 100%)'
    },
    {
      id: 'bases-datos',
      title: 'Bases de Datos',
      description: 'Modelado, SQL, NoSQL y administración',
      icon: '🗄️',
      color: 'success',
      gradient: 'linear-gradient(135deg, #b8a9d9 0%, #d4a5d4 100%)'
    },
    {
      id: 'ingenieria-software',
      title: 'Ingeniería de Software',
      description: 'Metodologías, patrones y arquitectura',
      icon: '⚙️',
      color: 'warning',
      gradient: 'linear-gradient(135deg, #ffdfba 0%, #ffcc9e 100%)'
    },
    {
      id: 'sistemas-operativos',
      title: 'Sistemas Operativos',
      description: 'Procesos, memoria, archivos y concurrencia',
      icon: '💻',
      color: 'info',
      gradient: 'linear-gradient(135deg, #bae1ff 0%, #9ed4ff 100%)'
    }
  ];

  const handleSubjectClick = (subjectId: string) => {
    // Aquí se implementará la navegación a la página específica de la materia
    console.log(`Navegando a: ${subjectId}`);
    // Por ahora solo mostramos un alert
    alert(`Próximamente: Página de ${subjects.find(s => s.id === subjectId)?.title}`);
  };

  return (
    <Container className="py-5">
      {/* Título de bienvenida */}
      <Row className="justify-content-center mb-5">
        <Col lg={10}>
          <div className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-3">
              ¡Bienvenido, {user?.nombre}! 👋
            </h1>
            <p className="lead text-muted">
              Explora los conceptos fundamentales de Ingeniería de Sistemas
            </p>
          </div>
        </Col>
      </Row>

      {/* Botones de materias */}
      <Row className="g-4">
        {subjects.map((subject) => (
          <Col key={subject.id} lg={6} xl={3}>
            <Card 
              className="h-100 shadow-sm border-0 subject-card"
              style={{ 
                background: subject.gradient,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => handleSubjectClick(subject.id)}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
                <div className="subject-icon mb-3" style={{ fontSize: '3rem' }}>
                  {subject.icon}
                </div>
                <Card.Title className="text-white fw-bold mb-2">
                  {subject.title}
                </Card.Title>
                <Card.Text className="text-white-50 mb-4">
                  {subject.description}
                </Card.Text>
                <Button 
                  variant="light" 
                  className="mt-auto"
                  style={{
                    borderRadius: '20px',
                    padding: '8px 20px',
                    fontWeight: '600',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  Explorar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Información adicional */}
      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)' }}>
            <Card.Body className="text-center p-4">
              <h5 className="text-primary mb-3">
                <i className="bi bi-info-circle me-2"></i>
                ¿Cómo usar la biblioteca?
              </h5>
              <Row>
                <Col md={4} className="mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">1</span>
                    </div>
                    <small className="text-muted">Selecciona una materia</small>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">2</span>
                    </div>
                    <small className="text-muted">Explora los conceptos</small>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">3</span>
                    </div>
                    <small className="text-muted">Aprende y practica</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
