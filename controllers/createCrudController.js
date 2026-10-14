function createCrudController(service) {
    return {
        async getAll(req, res) {
            res.json(await service.getAll(req.query));
        },

        async getById(req, res) {
            res.json(await service.getById(req.params.id));
        },

        async create(req, res) {
            res.status(201).json(await service.create(req.body));
        },

        async update(req, res) {
            res.json(await service.update(req.params.id, req.body));
        },

        async remove(req, res) {
            await service.remove(req.params.id);
            res.status(204).send();
        }
    };
}

module.exports = createCrudController;
