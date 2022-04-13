import { InventoryReportItem } from "./InventoryReport";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  TextField
} from "@mui/material";
import { Asset } from "../asset/Asset";
import { useState } from "react";
import AssetPicker from "../asset/AssetPicker";
import { usePagination } from "use-pagination-firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { firestore } from "../../index";
import { assetCollection, assetStockNumber } from "../../shared/const";
import { ExpandMoreRounded } from "@mui/icons-material";

export type FormValues = {
  balancePerCard: number,
  onHandCount: number,
  supplier: string,
}

type InventoryReportItemEditorProps = {
  isOpen: boolean,
  isCreate: boolean,
  item?: InventoryReportItem,
  onSubmit: (item: InventoryReportItem) => void,
  onDismiss: () => void,
}

export const InventoryReportItemEditor = (props: InventoryReportItemEditorProps) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [asset, setAsset] = useState<Asset | undefined>(undefined);
  const [isOpen, setOpen] = useState(false);

  const onPickerInvoke = () => setOpen(true);
  const onPickerDismiss = () => setOpen(false);

  const { items, isLoading, isStart, isEnd, getPrev, getNext } = usePagination<Asset>(
    query(collection(firestore, assetCollection), orderBy(assetStockNumber, "asc")), { limit: 15 }
  )

  const onSubmit = (values: FormValues) => {
    if (!asset) {
      return;
    }

    let item: InventoryReportItem = {
      stockNumber: asset.stockNumber,
      article: asset.classification,
      description: asset.description,
      type: asset.type,
      unitOfMeasure: asset.unitOfMeasure,
      unitValue: asset.unitValue,
      remarks: asset.remarks,
      balancePerCard: parseFloat(`${values.balancePerCard}`),
      onHandCount: parseFloat(`${values.onHandCount}`)
    }
    props.onSubmit(item)
    props.onDismiss()
  }

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={props.isOpen}
        onClose={props.onDismiss}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{t("dialog.details_inventory_item")}</DialogTitle>
          <DialogContent>
            <Container disableGutters>
              <TextField
                value={asset?.description ? asset?.description : t("field.not_set")}
                label={t("field.asset")}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onPickerInvoke} edge="end">
                        <ExpandMoreRounded/>
                      </IconButton>
                    </InputAdornment>
                  )
                }}/>
              <Divider sx={{ my: 2 }}/>
              <TextField
                autoFocus
                id="balancePerCard"
                type="number"
                label={t("field.balance_per_card")}
                defaultValue={props.item && props.item.balancePerCard}
                error={errors.balancePerCard !== undefined}
                helperText={errors.balancePerCard?.message && t(errors.balancePerCard?.message)}
                disabled={!asset}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                {...register("balancePerCard", { required: "feedback.empty_balance_per_card" })}/>
              <TextField
                id="onHandCount"
                type="number"
                label={t("field.on_hand_count")}
                defaultValue={props.item && props.item.onHandCount}
                error={errors.onHandCount !== undefined}
                helperText={errors.onHandCount?.message && t(errors.onHandCount?.message)}
                disabled={!asset}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                {...register("onHandCount", { required: "feedback.empty_on_hand_count" })}/>
              <TextField
                id="supplier"
                type="text"
                label={t("field.supplier")}
                defaultValue={props.item && props.item.supplier}
                error={errors.supplier !== undefined}
                helperText={errors.supplier?.message && t(errors.supplier?.message)}
                disabled={!asset}
                {...register("supplier", { required: "feedback.empty_supplier" })}/>
            </Container>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={props.onDismiss}>{t("button.cancel")}</Button>
            <Button
              color="primary"
              type="submit">{t("button.save")}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <AssetPicker
        isOpen={isOpen}
        assets={items}
        isLoading={isLoading}
        canBack={isStart}
        canForward={isEnd}
        onBackward={getPrev}
        onForward={getNext}
        onDismiss={onPickerDismiss}
        onSelectItem={setAsset}/>
    </>
  );
}