import { useTranslation } from "react-i18next";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    useMediaQuery,
    useTheme,
    makeStyles
} from "@material-ui/core";

import { usePermissions } from "../auth/AuthProvider";
import { Department } from "./Department";
import DepartmentList from "./DepartmentList";

import { ErrorNoPermissionState } from "../state/ErrorStates";

const useStyles = makeStyles(() => ({
    container: {
        minHeight: '60vh',
        paddingTop: 0,
        paddingBottom: 0,
        '& .MuiList-padding': {
            padding: 0
        }
    }
}));

type DepartmentPickerProps = {
    isOpen: boolean,
    departments: Department[],
    isLoading: boolean,
    hasPrevious: boolean,
    hasNext: boolean,
    onPrevious: () => void,
    onNext: () => void,
    onDismiss: () => void
    onSelectItem: (department: Department) => void
}

const DepartmentPicker = (props: DepartmentPickerProps) => {
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
            onClose={() => props.onDismiss()}>
            <DialogTitle>{ t("department_select") }</DialogTitle>
            <DialogContent dividers={true} className={classes.container}>
                { canRead
                    ? !props.isLoading
                        ? <DepartmentList
                            departments={props.departments}
                            hasPrevious={props.hasPrevious}
                            hasNext={props.hasNext}
                            onPrevious={props.onPrevious}
                            onNext={props.onNext}
                            onItemSelect={props.onSelectItem}/>
                        : <LinearProgress/>
                    : <ErrorNoPermissionState/>
                }
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => props.onDismiss()}>{ t("button.close") }</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DepartmentPicker;