
/*    +-----------------------------------------------------------------------+    */
/*    |    Do not edit this file directly.                                    |    */
/*    |    It was copied by redundancyJS.                                     |    */
/*    |    To modify it, first edit the source file (see redundancy.json).    |    */
/*    |    Then, run "npx redundancyjs" in the terminal.                      |    */
/*    +-----------------------------------------------------------------------+    */

/* do not edit */ 
/* do not edit */ 
/* do not edit */ import { Group } from "./Group";
/* do not edit */
/* do not edit */ 
/* do not edit */ 
/* do not edit */ export class User {
/* do not edit */     
/* do not edit */     public id: number;
/* do not edit */
/* do not edit */     
/* do not edit */     public username: string;
/* do not edit */
/* do not edit */     
/* do not edit */     public email: string;
/* do not edit */
/* do not edit */     
/* do not edit */     public isAdmin: boolean;
/* do not edit */
/* do not edit */     
/* do not edit */     
/* do not edit */     public groups: Group[];
/* do not edit */
/* do not edit */     
/* do not edit */     public createdGroups: Group[];
/* do not edit */
/* do not edit */     
/* do not edit */     public password: string;
/* do not edit */
/* do not edit */     
/* do not edit */     public passwordResetToken: string;
/* do not edit */
/* do not edit */     
/* do not edit */     public data: any;
/* do not edit */
/* do not edit */     
/* do not edit */     
/* do not edit */     public createdAt: Date;
/* do not edit */
/* do not edit */     
/* do not edit */     
/* do not edit */     public updatedAt: Date;
/* do not edit */
/* do not edit */     
/* do not edit */
/* do not edit */     
/* do not edit */
/* do not edit */     public noPreviousPeriods?: boolean;
/* do not edit */     public noFollowingPeriods?: boolean;
/* do not edit */     public selected?: boolean;
/* do not edit */
/* do not edit */     public jwtToken?: string;
/* do not edit */ }
/* do not edit */