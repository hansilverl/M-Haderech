import { useCallback } from 'react';

export const useFirebaseErrorTranslation = () => {
  const translateErrorToHebrew = useCallback((errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'כתובת אימייל לא חוקית.',
    'auth/user-disabled': 'המשתמש מושבת.',
    'auth/user-not-found': 'המשתמש לא נמצא.',
    'auth/wrong-password': 'סיסמה שגויה.',
    'auth/email-already-in-use': 'כתובת האימייל כבר בשימוש.',
    'auth/operation-not-allowed': 'הפעולה אינה מותרת.',
    'auth/weak-password': 'הסיסמה חלשה מדי.',
    'auth/too-many-requests': 'יותר מדי בקשות. נסה שוב מאוחר יותר.',
    'auth/app-deleted': 'האפליקציה נמחקה.',
    'auth/account-exists-with-different-credential': 'חשבון קיים עם פרטי התחברות שונים.',
    'auth/invalid-credential': 'אימייל או סיסמא לא נכונים.',
    'auth/invalid-verification-code': 'קוד אימות לא תקין.',
    'auth/invalid-verification-id': 'מזהה אימות לא תקין.',
    'auth/missing-verification-code': 'חסר קוד אימות.',
    'auth/missing-verification-id': 'חסר מזהה אימות.',
    'auth/credential-already-in-use': 'אישור התחברות זה כבר בשימוש.',
    'auth/invalid-phone-number': 'מספר טלפון לא חוקי.',
    'auth/missing-phone-number': 'חסר מספר טלפון.',
    'auth/quota-exceeded': 'המכסה הושלמה.',
    'auth/captcha-check-failed': 'אימות CAPTCHA נכשל.',
    'auth/invalid-app-credential': 'אישור אפליקציה לא תקין.',
    'auth/network-request-failed': 'הבקשה נכשלה עקב בעיית רשת.',
    'auth/requires-recent-login': 'יש לבצע כניסה מחדש.',
    'auth/second-factor-already-in-use': 'גורם שני זה כבר בשימוש.',
    'auth/maximum-second-factor-count-exceeded': 'הגעת למספר המקסימלי של גורמים שניים.',
    'auth/unsupported-first-factor': 'גורם ראשון לא נתמך.',
    'auth/second-factor-mismatch': 'התאמת גורם שני נכשלה.',
    'auth/invalid-multi-factor-session': 'סשן גורם מרובה לא תקין.',
    'auth/missing-multi-factor-info': 'חסרים פרטי גורם מרובה.',
    'auth/missing-multi-factor-session': 'חסר סשן גורם מרובה.',
    'auth/multi-factor-info-not-found': 'פרטי גורם מרובה לא נמצאו.',
    'auth/unauthorized-domain': 'דומיין לא מורשה.',
    'auth/unsupported-persistence-type': 'סוג עמידות לא נתמך.',
    'auth/unsupported-tenant-operation': 'פעולה לא נתמכת עבור הדייר הנוכחי.',
    'auth/unverified-email': 'כתובת האימייל לא אומתה.',
    };

    return errorMessages[errorCode] || 'אירעה שגיאה.';
  }, []);

  return translateErrorToHebrew;
};
