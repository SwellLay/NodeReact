import history from "customHistory";
import CustomerStatementServices from "../api/CustomerStatementServices";
import * as actionTypes from "../constants/ActionTypes";

import { errorHandle } from "../actions/errorHandling";

export const statementList = statements => {
    return {
        type: actionTypes.FETCH_CUSTOMER_STATEMENTS,
        payload: statements
    };
};

export const statement = statements => {
    return {
        type: actionTypes.FETCH_CUSTOMER_STATEMENTS,
        payload: statements
    };
};

export function fetchCustomerStatements(data) {
    return async dispatch => {
        return CustomerStatementServices.fetchCustomerStatements(data)
            .then(statementResponse => {
                console.log("=> fetchCustomerStatements Response ===> ", statementResponse);
                if (statementResponse.statusCode === 200) {
                    console.log(
                        " => inside success (200) statements list , ",
                        statementResponse.data
                    );
                    return dispatch(statementList(statementResponse.data));
                }
            })
            .catch(error => {
                console.log("--> error while fetching statements : => ", error);
            });
    };
}


export function getPublicStatement(uuid) {
    return async dispatch => {
        return CustomerStatementServices.getPublicStatement(uuid)
            .then(statementResponse => {
                console.log("=> getPublicStatement Response ===> ", statementResponse);
                if (statementResponse.statusCode === 200) {
                    console.log(
                        " => inside success (200) statements list , ",
                        statementResponse.data
                    );
                    return dispatch(statementList(statementResponse.data));
                }
            })
            .catch(error => {
                console.log("--> error while fetching statements : => ", error);
            });
    };
}

export function generateStatement(data) {
    return async dispatch => {
        return CustomerStatementServices.generateStatement(data)
        .then(statementResponse => {
            console.log("=> generateStatement Response ===> ", statementResponse);
                if (statementResponse.statusCode === 201) {
                    console.log(
                        " => inside success (200) generate statements , ",
                        statementResponse.data
                        );
                        return dispatch(statement(statementResponse.data));
                }
            })
            .catch(error => {
                console.log("--> error while generate statement : => ", error);
            });
    };
}