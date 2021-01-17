import React from 'react';


import { Location, History } from 'history';
import { match } from 'react-router-dom';


import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';


import ProjectView from '../components/ProjectView';

import { User } from '../models/users';
import { Project } from '../models/projects';


import { projectService } from '../services/project.service';
import { userService } from '../services/user.service';


import './ProjectPage.css';




interface CenterProps {
    location: Location
    history: History
    match: match
    selectedProj: Project | null
    onSaveProject(proj: Project, start?: Date, end?: Date): Promise<any>
    onDeleteProject(proj: Project): Promise<any>
    onProjectSelected(proj_id: number): void
    onWorking(working: boolean, errorText: string): void
}

interface CenterState {
    errorText: string
    create: boolean
    projects: Project[]
    showMine: boolean
    showEditProjectModal: boolean
}

class Center extends React.Component<CenterProps, CenterState> {

    state: Readonly<CenterState> = {
        errorText: '',
        create: false,
        projects: [],
        showMine: false,
        showEditProjectModal: false,
    };

    user: Readonly<User | null> = userService.getUser();

    componentDidMount() {
        const h = projectService.getAll({});
        h.ready.then(({ results }) => { debugger; this.setState({ projects: results }) })
    }

    componentDidUpdate(prevProps: CenterProps, prevState: CenterState) {
    }

    componentWillUnmount() {
    }

    render() {
        const selProj = this.props.selectedProj;

        return (
            <React.Fragment>
                <Col xs={{ order: 1 }}>
                    <Row className="mt-4">
                        <Col md={10}>
                            <h1>Projects</h1>
                        </Col>
                        <Col md={2} >
                            <Button
                                variant="primary"
                                title="Create Project"
                                className="float-right"
                                onClick={() => this.setState({ errorText: '', create: true, showEditProjectModal: true })}
                            >
                                New Project
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <small>
                                <FormCheck
                                    id="mineSwitch"
                                    type="switch"
                                    checked={this.state.showMine}
                                    onChange={() => this.setState({ showMine: !this.state.showMine })}
                                    label={this.state.showMine ? "Disable to show all projects" : "Enable to show my projects"}
                                />
                            </small>
                        </Col>
                    </Row>

                    <Row>
                        <Col><hr /></Col>
                    </Row>

                    <Row>
                        <Col className="overflow-auto">
                            <ul>
                                {this.state.projects.map(p => <li><a onClick={() => p.id && this.props.onProjectSelected(p.id)}>{p.name}</a></li>)}
                            </ul>
                        </Col>
                    </Row>

                    <Row className="my-4">
                        <Col> <hr /> </Col>
                    </Row>

                    {!selProj &&
                        <Row>
                            <Col>
                                <h4 className="text-center">Click a project</h4>
                            </Col>
                        </Row>

                    }
                    {selProj &&
                        <Row>
                            <Col>
                                <ProjectView
                                    history={this.props.history}
                                    proj={selProj}
                                    onEditProject={(proj) => {
                                        this.setState({
                                            showEditProjectModal: true,
                                            create: false,
                                            errorText: '',
                                        })
                                    }}
                                    onWorking={this.props.onWorking}
                                />
                            </Col>
                        </Row>
                    }

                </Col>
            </React.Fragment>
        );

    }
}

interface Props {
    location: Location
    history: History
    match: match
}

interface State {
    selectedProj: Project | null
    working: boolean
    errorText: string
}


class ProjectPage extends React.Component<Props, State> {

    state: Readonly<State> = {
        selectedProj: null,
        working: false,
        errorText: '',
    };

    user: Readonly<User | null> = userService.getUser();

    constructor(props: Props) {
        super(props);

        this.onProjectSelected = this.onProjectSelected.bind(this);
        this.onSaveProject = this.onSaveProject.bind(this);
        this.onDeleteProject = this.onDeleteProject.bind(this);
        this.onWorking = this.onWorking.bind(this);
    }

    onWorking(working: boolean, errorText: string) {
        this.setState({ working: working, errorText: errorText });
    }


    onSaveProject(proj: Project, start?: Date, end?: Date) {

        /*
        if (proj.parentProj) {
            debugger
            proj.parent = proj.parentProj.id || null;
        }
        */

        if (proj.id) {

            this.setState({ working: true, errorText: '' })
            return projectService.save(proj)
                .then(proj => {
                    // use the child info we already have, instead
                    if (this.state.selectedProj) {
                        proj.children = this.state.selectedProj.children;
                    }
                    Object.assign(this.state.selectedProj, proj);
                    this.setState({
                        working: false,
                        selectedProj: proj
                    })
                }, error => {
                    this.setState({ working: false, errorText: error })
                    return Promise.reject(error);
                })
        }

        // If we get here, then we are creating a new project

        if (!(start && end)) return Promise.reject();

        this.setState({ working: true, errorText: '' })

        return projectService.create(proj, start, end)
            .then(proj => {

                this.setState({
                    working: false,
                    selectedProj: { ...proj }
                });

                const url = this.props.history.location.pathname + '/' + String(proj.id)
                this.props.history.push(url);
            }, error => {
                this.setState({ working: false })
                return Promise.reject(error);
            });
    }

    onDeleteProject(proj: Project): Promise<any> {
        if (!proj.id) return Promise.reject();

        this.setState({ working: true });
        return projectService.del(proj)
            .then(res => {
                this.setState({ working: false }, () => {
                    const url = this.props.match.url + "/" + proj.parentProj?.path;
                    this.props.history.push(url, { reload: true });
                });
            });
    }


    onProjectSelected(proj_id: number) {
        if (proj_id) {
            projectService.get(proj_id)
                .then(proj => {
                    this.setState({ selectedProj: proj })
                })
        } else {
            this.setState({ selectedProj: null })
        }
    }


    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
    }


    render() {

        return (
            <Container fluid>
                <Row className="flex-xl-nowrap">
                    <Center
                        location={this.props.location}
                        match={this.props.match}
                        history={this.props.history}
                        selectedProj={this.state.selectedProj}
                        onWorking={this.onWorking}
                        onSaveProject={this.onSaveProject}
                        onDeleteProject={this.onDeleteProject}
                        onProjectSelected={this.onProjectSelected}
                    />
                </Row>
                <Navbar fixed="bottom">
                    <Navbar.Text>
                        {this.state.working &&
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        }
                    </Navbar.Text>
                    <Navbar.Text>
                        {this.state.errorText && <div className="p-1 m-2 bg-danger text-white"> {this.state.errorText} </div>}
                    </Navbar.Text>
                </Navbar>
            </Container>
        );
    }
}

export default ProjectPage;
