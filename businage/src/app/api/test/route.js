export async function POST(request) {

    const product = await request.json()
   
    return Response.json({ ...product })
}