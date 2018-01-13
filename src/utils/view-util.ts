export class ViewUtil {

    public static presentToast(toastCtrl: any, message: string, duration?: number, position?: string) {
        if (!duration) {
            duration = 3000;
        }
        let toast = toastCtrl.create({
            message: message,
            duration: duration,
            position: position
        });

        toast.onDidDismiss(() => {
            //doNothing
        });

        toast.present();
    }
}