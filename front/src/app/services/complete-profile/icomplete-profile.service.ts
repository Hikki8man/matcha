import { Observable } from 'rxjs';

export abstract class ICompleteProfileService {
    public abstract completeFirstStep(): Observable<void>;
    public abstract completeSecondStep(): Observable<void>;
    public abstract completeThirdStep(): Observable<void>;

    public abstract isProfileCompleteGuard(): boolean;
    public abstract isProfileNotCompleteGuard(): boolean;
}
