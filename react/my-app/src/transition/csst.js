import React, {useState} from 'react';
import {Container, Button, Alert, ListGroup} from 'react-bootstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import uuid from 'uuid';
import './css/csst.css';

export default function CSST() {
    const [showButton, setShowButton] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    return (
        <Container style={{paddingTop: '2rem'}}>
            {
                showButton && (
                    <Button
                        onClick={() => setShowMessage(true)}
                        size="lg"
                    >showMessage</Button>
                )
            }
            <CSSTransition
                in={showMessage}
                timeout={300}
                classNames="alert"
                unmountOnExit
                onEnter={() => setShowButton(false)}
                onExited={() => setShowButton(true)}

            >
                <Alert
                    variant="primary"
                    dismissible
                    onClose={() => setShowMessage(false)}>
                    <Alert.Heading>Animated alert message</Alert.Heading>
                    <p>This alert message is being transitioned in and out of the dom.</p>
                    <Button onClick={() => setShowMessage(false)}>close</Button>
                </Alert>
            </CSSTransition>
        </Container>
    );
}

export function TodoList() {
    const [items, setItems] = useState([
        { id: uuid(), text: 'Buy eggs' },
        { id: uuid(), text: 'Pay bills' },
        { id: uuid(), text: 'Invite friends over' },
        { id: uuid(), text: 'Fix the TV' },
    ]);
    return (
        <Container style={{ marginTop: '2rem' }}>
            <ListGroup style={{ marginBottom: '1rem' }}>
                <TransitionGroup className="todo-list">
                    {items.map(({ id, text }) => (
                        <CSSTransition
                            key={id}
                            timeout={500}
                            classNames="item"
                        >
                            <ListGroup.Item>
                                <Button
                                    className="remove-btn"
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        setItems(items =>
                                            items.filter(item => item.id !== id)
                                        )
                                    }
                                >
                                    &times;
                                </Button>
                                {text}
                            </ListGroup.Item>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </ListGroup>
            <Button
                onClick={() => {
                    const text = prompt('Enter some text');
                    if (text) {
                        setItems(items => [
                            ...items,
                            { id: uuid(), text },
                        ]);
                    }
                }}
            >
                Add Item
            </Button>
        </Container>
    );
}
