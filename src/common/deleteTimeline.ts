import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import db from '../firebase';

/** userChangeModal内で表示しているユーザ名を削除する処理 */
export const deleteUserInfo = (info: string) => {
  const collectionUserInfo = collection(db, 'current_user_info');
  getDocs(collectionUserInfo)
    .then((querySnapshot) => {
      const { docs } = querySnapshot;
      (async () => {
        await Promise.all(
          docs.map((count) => {
            const id = info;
            console.log(count);
            return deleteDoc(doc(collectionUserInfo, id));
          })
        );
      })().catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/** 初回レンダリング時にhomeで表示しているuserプロフィール情報を削除する処理 */
export const deleteProfile = () => {
  const collectionProfile = collection(db, 'profile_data');
  getDocs(collectionProfile)
    .then((querySnapshot) => {
      const { docs } = querySnapshot;
      (async () => {
        await Promise.all(
          docs.map((document) => {
            const { id } = document;
            return deleteDoc(doc(collectionProfile, id));
          })
        );
      })().catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/** homeで表示しているTL情報を削除する処理 */
export const deleteTimeline = () => {
  const collectionTimeline = collection(db, 'timeline_data');
  getDocs(collectionTimeline)
    .then((querySnapshot) => {
      const { docs } = querySnapshot;
      (async () => {
        await Promise.all(
          docs.map((document) => {
            const { id } = document;
            return deleteDoc(doc(collectionTimeline, id));
          })
        );
      })().catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/** 初回レンダリング時にhomeで表示している自分プロフィール情報を削除する処理 */
export const deleteMyProfile = () => {
  const collectionProfile = collection(db, 'my_profile_data');
  getDocs(collectionProfile)
    .then((querySnapshot) => {
      const { docs } = querySnapshot;
      (async () => {
        await Promise.all(
          docs.map((document) => {
            const { id } = document;
            return deleteDoc(doc(collectionProfile, id));
          })
        );
      })().catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/** 初回レンダリング時にhomeで表示している自分TL情報を削除する処理 */
export const deleteMyTimeline = () => {
  const collectionTimeline = collection(db, 'my_timeline_data');
  getDocs(collectionTimeline)
    .then((querySnapshot) => {
      const { docs } = querySnapshot;
      (async () => {
        await Promise.all(
          docs.map((document) => {
            const { id } = document;
            return deleteDoc(doc(collectionTimeline, id));
          })
        );
      })().catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
