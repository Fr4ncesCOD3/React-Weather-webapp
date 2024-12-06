import { Modal, Button } from 'react-bootstrap';

function ModalCheck({ onAccept, onDecline }) {
  return (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Richiesta di Geolocalizzazione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Vuoi permettere all'applicazione di accedere alla tua posizione per fornirti informazioni meteo più accurate?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onDecline}>
          Rifiuta
        </Button>
        <Button variant="primary" onClick={onAccept}>
          Accetta
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCheck;
