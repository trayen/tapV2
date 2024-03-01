// Graph.jsx
import React, { useEffect, useState } from 'react';
import { getAllBureaus } from '../api/bureauApi';
import { Accordion, Dropdown } from 'react-bootstrap';
import './Graph.css';

const Graph = () => {
    const [bureaus, setBureaus] = useState([]);
    const [groupedBureaus, setGroupedBureaus] = useState([]);
    const [selectedBlocIndex, setSelectedBlocIndex] = useState(null);
    const [selectedLevelIndex, setSelectedLevelIndex] = useState(null);
    const [showOption, setShowOption] = useState('all'); // Options: 'all', 'available', 'unavailable'

    useEffect(() => {
        const fetchBureaus = async () => {
            try {
                const allBureaus = await getAllBureaus();
                setBureaus(allBureaus);
                groupBureaus(allBureaus);
            } catch (error) {
                console.error('Error fetching bureaus:', error);
            }
        };

        fetchBureaus();
    }, []);

    const groupBureaus = (allBureaus) => {
        const groupedData = allBureaus.reduce((acc, bureau) => {
            const blocKey = bureau.bloc.toLowerCase();
            const levelKey = bureau.level.toLowerCase();

            if (!acc[blocKey]) {
                acc[blocKey] = { levels: {} };
            }

            if (!acc[blocKey].levels[levelKey]) {
                acc[blocKey].levels[levelKey] = [];
            }

            acc[blocKey].levels[levelKey].push(bureau);
            return acc;
        }, {});

        const groupedBureaus = Object.entries(groupedData).map(([bloc, { levels }]) => ({
            bloc,
            levels: Object.entries(levels).map(([level, data]) => ({
                level,
                data,
            })),
        }));

        setGroupedBureaus(groupedBureaus);
    };

    const toggleBloc = (blocIndex) => {
        setSelectedBlocIndex((prevIndex) => (prevIndex === blocIndex ? null : blocIndex));
        setSelectedLevelIndex(null); // Close the selected level when a new bloc is opened
    };

    const toggleLevel = (levelIndex) => {
        setSelectedLevelIndex((prevIndex) => (prevIndex === levelIndex ? null : levelIndex));
    };

    const handleShowOptionChange = (option) => {
        setShowOption(option);
    };

    return (
        <div>
            <h2>Graphique des Bureaux</h2>
            <br />
            <Dropdown onSelect={(eventKey) => handleShowOptionChange(eventKey)}>
                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{ minWidth: '150px' }}>
                    {showOption === 'all' && 'Afficher Tout'}
                    {showOption === 'available' && 'Afficher Disponible Uniquement'}
                    {showOption === 'unavailable' && 'Afficher Indisponible Uniquement'}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <Dropdown.Item eventKey="all">Afficher Tout</Dropdown.Item>
                    <Dropdown.Item eventKey="unavailable">Afficher Indisponible Uniquement</Dropdown.Item>
                    <Dropdown.Item eventKey="available">Afficher Disponible Uniquement</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <br />

            <Accordion>
                {groupedBureaus
                    .filter(({ levels }) =>
                        levels.some(({ data }) =>
                            data.some((bureau) =>
                                showOption === 'all' ||
                                (showOption === 'unavailable' && bureau.isAvailable) ||
                                (showOption === 'available' && !bureau.isAvailable)
                            )
                        )
                    )
                    .map(({ bloc, levels }, blocIndex) => {
                        const isBlocSelected = selectedBlocIndex === blocIndex;

                        return (
                            <Accordion.Item key={blocIndex} eventKey={blocIndex.toString()}>
                                <Accordion.Header
                                    onClick={() => toggleBloc(blocIndex)}
                                    className={isBlocSelected ? 'active' : ''}
                                >
                                    Bloc : {bloc}
                                </Accordion.Header>
                                <Accordion.Body className={isBlocSelected ? 'show' : 'hide'}>
                                    <Accordion>
                                        {levels.map(({ level, data }, levelIndex) => {
                                            const isLevelSelected = selectedLevelIndex === levelIndex;
                                            const showLevel = data
                                                .some((bureau) =>
                                                    showOption === 'all' ||
                                                    (showOption === 'unavailable' && bureau.isAvailable) ||
                                                    (showOption === 'available' && !bureau.isAvailable)
                                                );

                                            return (
                                                showLevel && (
                                                    <Accordion.Item key={levelIndex} eventKey={levelIndex.toString()}>
                                                        <Accordion.Header
                                                            onClick={() => toggleLevel(levelIndex)}
                                                            className={isLevelSelected ? 'active' : ''}
                                                        >
                                                            Niveau : {level}
                                                        </Accordion.Header>

                                                        <Accordion.Body className={isLevelSelected ? 'show' : 'hide'}>
                                                            {data.map((bureau) => (
                                                                (showOption === 'all' || (showOption === 'available' && !bureau.isAvailable) || (showOption === 'unavailable' && bureau.isAvailable)) ? (
                                                                    <div key={bureau._id} className={`bureau-info ${bureau.isAvailable ? 'unavailable' : 'available'}`}>
                                                                        {bureau.number !== 'Hidden' && (
                                                                            <>
                                                                                <strong>Numéro :</strong> {bureau.number}, <strong>Espace :</strong> {bureau.space}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                ) : null
                                                            ))}
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                )
                                            );
                                        })}
                                    </Accordion>
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
            </Accordion>
        </div>
    );
};

export default Graph;
