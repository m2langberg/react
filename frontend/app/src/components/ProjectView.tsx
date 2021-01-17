import * as React from 'react';

import { History } from 'history';

//import Alert from 'react-bootstrap/Alert';
//import Button from 'react-bootstrap/Button';
//import Col from 'react-bootstrap/Col';
//import Collapse from 'react-bootstrap/Collapse';
//import FormCheck from 'react-bootstrap/FormCheck';
//import Table from 'react-bootstrap/Table';
//import Row from 'react-bootstrap/Row';



import { User } from '../models/users';
import { Project } from '../models/projects';


//import { projectService } from '../services/project.service';
import { userService } from '../services/user.service';




interface ProjectViewProps {
    history: History
    proj: Project
    onEditProject(proj: Project): void
    onWorking(working: boolean, errorText: string): any
}



function ProjectView(props: ProjectViewProps) {

    const user: Readonly<User | null> = userService.getUser();


    if (!props.proj.id) return (<></>);

    return (
        <React.Fragment>
        
            <h1>{props.proj?.name}</h1> 
            
            <p>You are {user?.first_name} {user?.last_name}</p>
            
        </React.Fragment>
    );
}


export default ProjectView;
