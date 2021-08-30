import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, makeStyles } from "@material-ui/core/styles";

import { User } from "./User";
import UserList from "./UserList";

import PaginationController from "../../components/PaginationController";
import { ErrorNoPermissionState } from "../state/ErrorStates";
import { usePermissions } from "../auth/AuthProvider";

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: 0,
        paddingBottom: 0,
        '& .MuiList-padding': {
            padding: 0
        }
    }
}));

type UserPickerProps = {
    isOpen: boolean,
    users: User[],
    isLoading: boolean,
    hasPrevious: boolean,
    hasNext: boolean,
    onPrevious: () => void,
    onNext: () => void,
    onDismiss: () => void,
    onSelectItem: (user: User) => void,
}

const UserPicker = (props: UserPickerProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const classes = useStyles();
    const { canRead } = usePermissions();

    return (
        <Dialog
            fullScreen={isMobile}
            fullWidth={true}
            maxWidth="xs"
            open={props.isOpen}
            onClose={props.onDismiss}>
            <DialogTitle>{ t("user_select") }</DialogTitle>
            <DialogContent dividers={true} className={classes.container}>
                { props.isLoading && <LinearProgress/> }
                { canRead 
                    ? 
                    <>
                        <UserList
                            users={props.users}
                            onItemSelect={props.onSelectItem}/>
                    { props.users.length > 0 && 
                        <PaginationController
                            hasPrevious={props.hasPrevious}
                            hasNext={props.hasNext}
                            getPrevious={props.onPrevious}
                            getNext={props.onNext}/>
                    }
                    </>
                    : <ErrorNoPermissionState/>
                }
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={props.onDismiss}>{ t("close") }</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserPicker;