import { z } from 'zod'
import { messages, regex } from '@/utilities/validation'

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
		newPassword: z
			.string()
			.min(1, { message: messages.required })
			.regex(regex.uppercase, { message: messages.uppercase })
			.regex(regex.lowercase, { message: messages.lowercase })
			.regex(regex.number, { message: messages.number })
			.regex(regex.special, { message: messages.special })
			.regex(regex.length, { message: messages.length })
			.refine((value) => !regex.repeat.test(value), {
				message: messages.repeat
			})
			.refine((value) => !regex.sequential.test(value), {
				message: messages.sequential
			})
	})
)

export type RequestUnlockAccountPayload = z.infer<typeof RequestUnlockAccountSchema>
export type CheckOTPPayload = z.infer<typeof CheckOTPSchema>
export type UnlockAccountPayload = z.infer<typeof UnlockAccountSchema>
