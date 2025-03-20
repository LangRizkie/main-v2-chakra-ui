import { z } from 'zod'
import { messages } from '@/utilities/validation'

export const RequestUnlockAccountSchema = z.object({
	email: z.string().email().min(1, { message: messages.required }),
	username: z.string().min(1, { message: messages.required })
})

export const CheckOTPSchema = z.object({
	otp: z.string().min(1, { message: messages.required }),
	username: z.string().min(1, { message: messages.required })
})

export const UnlockAccountSchema = CheckOTPSchema.merge(
	z.object({
		confirmationPassword: z.string().min(1, { message: messages.required }),
		newPassword: z.string().min(1, { message: messages.required })
	})
)

export type RequestUnlockAccountPayload = z.infer<typeof RequestUnlockAccountSchema>
export type CheckOTPPayload = z.infer<typeof CheckOTPSchema>
export type UnlockAccountPayload = z.infer<typeof UnlockAccountSchema>
