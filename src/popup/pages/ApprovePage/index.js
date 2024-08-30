import { updateApproveStatus } from "@/reducers/popupReducer";
import i18n from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DAPP_ACTION_GET_ACCOUNT,
  GET_APPROVE_PARAMS
} from "../../../constant/msgTypes";
import { sendMsg } from "../../../utils/commonMsg";
import { addressSlice } from "../../../utils/utils";
import Button, { button_size, button_theme } from "../../component/Button";
import DappWebsite from "../../component/DappWebsite";
import styles from "./index.module.scss";

const ApprovePage = () => {
  const dispatch = useDispatch();

  const currentAccount = useSelector(
    (state) => state.accountInfo.currentAccount
  );

  const [params, setParams] = useState({});

  useEffect(() => {
    sendMsg(
      {
        action: GET_APPROVE_PARAMS,
      },
      (data) => {
        setParams(data)
      }
    );
  }, []);



  const onCancel = useCallback(() => {
    sendMsg(
      {
        action: DAPP_ACTION_GET_ACCOUNT,
        payload: {
          selectAccount: [],
          currentAddress: currentAccount.address,
          resultOrigin: params?.site?.origin,
          id: params?.id,
        },
      },
      async () => {
        dispatch(updateApproveStatus(false));
      }
    );
  }, [currentAccount,params]);

  const onConfirm = useCallback(() => {
    let selectAccount = [currentAccount];
    sendMsg(
      {
        action: DAPP_ACTION_GET_ACCOUNT,
        payload: {
          selectAccount,
          resultOrigin: params?.site?.origin,
          id: params.id,
        },
      },
      () => {
        dispatch(updateApproveStatus(false));
      }
    );
  }, [params, currentAccount]);


  const showAccountInfo = useMemo(() => {
    return (
      currentAccount.accountName +
      "(" +
      addressSlice(currentAccount.address, 6) +
      ")"
    );
  }, [currentAccount]);

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <p className={styles.title}>{i18n.t("connectionRequest")}</p>
      </div>
      <div className={styles.content}>
        <div className={styles.websiteContainer}>
          <DappWebsite siteIcon={params?.site?.webIcon} siteUrl={params?.site?.origin} />
        </div>
        <p className={styles.accountTip}>{i18n.t("approveTip") + ":"}</p>
        <p className={styles.accountAddress}>{showAccountInfo}</p>
      </div>
      <div className={styles.bottomView}>
      <p className={styles.warningTip}>{i18n.t('approveWaring')}</p>
        <div className={styles.btnGroup}>
          <Button
            onClick={onCancel}
            theme={button_theme.BUTTON_THEME_LIGHT}
            size={button_size.middle}
          >
            {i18n.t("cancel")}
          </Button>
          <Button size={button_size.middle} onClick={onConfirm}>
            {i18n.t("connect")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApprovePage;
